// presentation/components/TranslatorBox.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
// import { useDebounce } from "use-debounce";
import { TextArea } from "../elements/Translator-Box/TextArea";
import LanguageSelector from "../elements/Translator-Box/LanguageSelector";
import { LanguageShort, Tone } from "@/shared/types/types";
import { toneStyle } from "@/shared/constants/tone-style";
import { createLogger } from "@/shared/utils/logger";

type RequestKey = string;

function makeRequestKey(
	text: string,
	fromLang: LanguageShort,
	toLang: LanguageShort,
	tone: Tone
): RequestKey {
	return `${text}\u241F${fromLang}\u241F${toLang}\u241F${tone}`;
}

export const TranslatorBox: React.FC = () => {
	// ────────────────────────────────────────────────────────────────────────────
	// UI state
	// ────────────────────────────────────────────────────────────────────────────
	const [tone, setTone] = useState<Tone>(toneStyle.natural);
	const [fromLang, setFromLang] = useState<LanguageShort>("ru");
	const [toLang, setToLang] = useState<LanguageShort>("es");

	// Дебаунс: 0 мс сразу после swap, 800 мс обычно
	// const DEFAULT_DEBOUNCE = 800;
	// const [debounceMs, setDebounceMs] = useState<number>(DEFAULT_DEBOUNCE);

	// Текущий активный запрос (чтобы не запускать повторно)
	const activeKeyRef = useRef<RequestKey>("");
	
	// Logger с уникальным ID для этого компонента
	const loggerRef = useRef(createLogger("TranslatorBox"));
	const currentRequestLoggerRef = useRef<ReturnType<typeof createLogger> | null>(null);

	// Swap-индикатор: вернуть дебаунс после завершения
	const swappedOnceRef = useRef<boolean>(false);

	// ────────────────────────────────────────────────────────────────────────────
	// Vercel AI SDK
	// ────────────────────────────────────────────────────────────────────────────
	const {
		input,
		setInput,
		handleInputChange,
		complete,
		completion,
		isLoading,
		error,
		stop,
		setCompletion,
	} = useCompletion({
		api: "/api/translate-stream",
		streamProtocol: "text",
		onFinish: (prompt, completion) => {
			if (currentRequestLoggerRef.current) {
				currentRequestLoggerRef.current.streamEnd();
				currentRequestLoggerRef.current.success("Translation completed successfully", {
					completionLength: completion.length,
					completionPreview: completion.substring(0, 100) + (completion.length > 100 ? '...' : '')
				});
			} else {
				loggerRef.current.success("Translation completed (no active request logger)");
			}
			
			activeKeyRef.current = "";
			currentRequestLoggerRef.current = null;
			
			if (swappedOnceRef.current) {
				swappedOnceRef.current = false;
				// setDebounceMs(DEFAULT_DEBOUNCE);
			}
		},
		onError: (err: Error) => {
			if (currentRequestLoggerRef.current) {
				currentRequestLoggerRef.current.streamAbort(err);
				currentRequestLoggerRef.current.error("Translation failed", err, {
					errorName: err.name,
					errorMessage: err.message
				});
			} else {
				loggerRef.current.error("Translation failed (no active request logger)", err);
			}
			
			activeKeyRef.current = "";
			currentRequestLoggerRef.current = null;
			
			if (swappedOnceRef.current) {
				swappedOnceRef.current = false;
				// setDebounceMs(DEFAULT_DEBOUNCE);
			}
		},
	});

	// const [debouncedInputText] = useDebounce(input, debounceMs);

	// ────────────────────────────────────────────────────────────────────────────
	// Monitoring completion updates
	// ────────────────────────────────────────────────────────────────────────────
	useEffect(() => {
		if (currentRequestLoggerRef.current && completion) {
			currentRequestLoggerRef.current.debug("Completion updated", {
				completionLength: completion.length,
				completionPreview: completion.substring(0, 100) + (completion.length > 100 ? '...' : ''),
				isLoading
			});
		}
	}, [completion, isLoading]);

	// ────────────────────────────────────────────────────────────────────────────
	// Handlers
	// ────────────────────────────────────────────────────────────────────────────
	//   const handleInputChange = useCallback(
	//     (text: string) => {
	//       // Остановим текущий стрим, если идёт
	//       if (isLoading) stop();
	//       activeKeyRef.current = "";
	//       setCompletion(""); // очистим правую панель
	//       setInput(text);
	//     },
	//     [isLoading, stop, setCompletion]
	//   );

	const handleClearInput = useCallback(() => {
		loggerRef.current.info("Clearing input", { wasLoading: isLoading });
		
		if (isLoading) {
			if (currentRequestLoggerRef.current) {
				currentRequestLoggerRef.current.streamAbort("User cleared input");
			}
			stop();
		}
		
		activeKeyRef.current = "";
		currentRequestLoggerRef.current = null;
		setInput("");
		setCompletion("");
	}, [isLoading, stop, setCompletion, setInput]);

	const handleLanguageChange = useCallback(
		(from: LanguageShort, to: LanguageShort) => {
			loggerRef.current.info("Language change", { 
				from: { old: fromLang, new: from }, 
				to: { old: toLang, new: to },
				wasLoading: isLoading
			});
			
			if (isLoading) {
				if (currentRequestLoggerRef.current) {
					currentRequestLoggerRef.current.streamAbort("Language changed during translation");
				}
				stop();
			}
			
			activeKeyRef.current = "";
			currentRequestLoggerRef.current = null;
			setCompletion(""); // обнулим результат, чтобы не путал
			setFromLang(from);
			setToLang(to);
		},
		[isLoading, stop, setCompletion, fromLang, toLang]
	);

	const handleSwapResultToInputText = useCallback(() => {
		const translatedText = completion?.trim() ?? "";
		if (!translatedText) {
			loggerRef.current.warn("Attempted to swap but no translation text available");
			return;
		}

		loggerRef.current.info("Swapping result to input", { 
			translatedTextLength: translatedText.length,
			currentDirection: `${fromLang} -> ${toLang}`,
			newDirection: `${toLang} -> ${fromLang}`,
			wasLoading: isLoading
		});

		// Остановим текущий стрим и подготовим новый
		if (isLoading) {
			if (currentRequestLoggerRef.current) {
				currentRequestLoggerRef.current.streamAbort("User swapped languages");
			}
			stop();
		}
		
		activeKeyRef.current = "";
		currentRequestLoggerRef.current = null;
		setCompletion("");
		setInput(translatedText);

		// Поменяем направления
		setFromLang((prevFrom) => {
			const oldFrom = prevFrom;
			setToLang(oldFrom);
			return toLang; // новый from = старый to
		});

		// Один немедленный перевод без debounce, потом вернём дефолт
		swappedOnceRef.current = true;
		// setDebounceMs(0);
	}, [completion, isLoading, stop, setCompletion, toLang, fromLang, setInput]);

	// ────────────────────────────────────────────────────────────────────────────
	// Оркестратор перевода — без зацикливания
	// ────────────────────────────────────────────────────────────────────────────
	// useEffect(() => {
	// 	const text = debouncedInputText.trim();

	// 	// Ничего не переводим при пустом вводе
	// 	if (!text) return;

	// 	// Нельзя переводить в тот же язык
	// 	if (fromLang === toLang) return;

	// 	const key = makeRequestKey(text, fromLang, toLang, tone);

	// 	// Если уже стартовали этот же запрос — выходим
	// 	if (activeKeyRef.current === key) return;

	// 	// Обновим ключ до старта, чтобы повторный ререндер не начал второй раз
	// 	activeKeyRef.current = key;

	// 	// Запускаем стрим. Сервер читает body, prompt игнорируется.
	// 	void complete("", {
	// 		body: { text, fromLang, toLang, tone },
	// 	});
	// }, [debouncedInputText, fromLang, toLang, tone, complete]);

	// ────────────────────────────────────────────────────────────────────────────
	// UI
	// ────────────────────────────────────────────────────────────────────────────
	const displayText = error?.message || completion;

	const placeholder = isLoading
		? "Translating..."
		: error
		? "Error occurred"
		: "Translation will appear here...";

	return (
		<div className="w-full min-h-[50vh] max-h-content mx-auto space-y-2 md:space-y-4 flex flex-col">
			<LanguageSelector
				fromLang={fromLang}
				toLang={toLang}
				tone={tone}
				onToneChange={setTone}
				onLanguageChange={handleLanguageChange}
				onSwapResultToInputText={handleSwapResultToInputText}
			/>
			<div className="flex justify-end">
					<button
						onClick={() => {
							const text = input.trim();
					
							// Ничего не переводим при пустом вводе
							if (!text) {
								loggerRef.current.warn("Translation attempted with empty text");
								return;
							}
					
							// Нельзя переводить в тот же язык
							if (fromLang === toLang) {
								loggerRef.current.warn("Translation attempted with same source and target language", {
									language: fromLang
								});
								return;
							}
					
							const key = makeRequestKey(text, fromLang, toLang, tone);
					
							// Если уже стартовали этот же запрос — выходим
							if (activeKeyRef.current === key) {
								loggerRef.current.warn("Duplicate translation request ignored", { requestKey: key });
								return;
							}
					
							// Создаем новый logger для этого запроса
							const requestLogger = createLogger("Translation");
							currentRequestLoggerRef.current = requestLogger;
							
							requestLogger.info("Starting translation request", {
								textLength: text.length,
								textPreview: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
								fromLang,
								toLang,
								tone,
								requestKey: key
							});
					
							// Обновим ключ до старта, чтобы повторный ререндер не начал второй раз
							activeKeyRef.current = key;
							
							requestLogger.streamStart({
								endpoint: "/api/translate-stream",
								method: "POST"
							});
					
							// Запускаем стрим. Сервер читает body, prompt игнорируется.
							void complete("", {
								body: { text, fromLang, toLang, tone },
							});
						}}
						className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
					>
						Translate
					</button>
				</div>

			
				<div className="flex justify-end">
					<button
						onClick={() => {
							if (currentRequestLoggerRef.current) {
								currentRequestLoggerRef.current.streamAbort("User manually stopped translation");
								currentRequestLoggerRef.current.warn("Translation manually stopped by user");
							} else {
								loggerRef.current.warn("Stop translation clicked but no active request logger");
							}
							stop();
						}}
						disabled={!isLoading}
						className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
					>
						Stop Translation
					</button>
				</div>
			

			<div className="w-full flex-1 grid grid-cols-1 gap-3 md:gap-4 mb-4 md:mb-8 lg:grid-cols-2 bg-gradient-to-t from-red-900/20 to-[90%] from-[#121214] rounded-xl px-3 md:px-4 pb-3 md:pb-4">
				<TextArea
					value={input}
					onChange={handleInputChange}
					onClear={handleClearInput}
					placeholder="Enter text to translate..."
					isInput={true}
					maxLength={10000}
				/>

				<TextArea
					value={displayText}
					placeholder={placeholder}
					isInput={false}
					readOnly={true}
					className={error ? "text-red-400" : ""}
				/>
			</div>
		</div>
	);
};
