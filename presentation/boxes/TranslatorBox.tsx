// presentation/components/TranslatorBox.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { useDebounce } from "use-debounce";
import { useSession } from "next-auth/react";
import { TextArea } from "../elements/Translator-Box/TextArea";
import LanguageSelector from "../elements/Translator-Box/BoxTranslateOptions";
import { LanguageShort, Tone } from "@/shared/config/translation";
// import { createLogger } from "@/shared/utils/logger";
import CustomPlaceholder from "../components/textArea/CustomPlaceholder";
import {
	useFromLang,
	useToLang,
	useTone,
	useSetFromLang,
	useSetToLang,
	useSetTone,
} from "../stores/translatorStore";
import {
	useDefaultSourceLang,
	useDefaultTargetLang,
	useTranslationStyle,
	useLoadSettings,
} from "../stores/settingsStore";

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
	// Store state
	// ────────────────────────────────────────────────────────────────────────────
	const fromLang = useFromLang();
	const toLang = useToLang();
	const tone = useTone();
	const { data: session } = useSession();

	// Settings store hooks for loading user preferences
	const defaultSourceLang = useDefaultSourceLang();
	const defaultTargetLang = useDefaultTargetLang();
	const defaultTranslationStyle = useTranslationStyle();
	const loadSettings = useLoadSettings();

	// Translator store setters
	const setFromLang = useSetFromLang();
	const setToLang = useSetToLang();
	const setTone = useSetTone();

	// ────────────────────────────────────────────────────────────────────────────
	// UI state
	// ────────────────────────────────────────────────────────────────────────────

	// Load user settings and apply to translator store
	useEffect(() => {
		if (session?.user?.id) {
			void loadSettings();
		}
	}, [session?.user?.id, loadSettings]);

	// Apply loaded settings to translator store
	useEffect(() => {
		if (defaultSourceLang && defaultSourceLang !== "auto") {
			setFromLang(defaultSourceLang as LanguageShort);
		}
		if (defaultTargetLang) {
			setToLang(defaultTargetLang);
		}
		if (defaultTranslationStyle) {
			setTone(defaultTranslationStyle);
		}
	}, [
		defaultSourceLang,
		defaultTargetLang,
		defaultTranslationStyle,
		setFromLang,
		setToLang,
		setTone,
	]);

	// Дебаунс: 0 мс сразу после swap, 800 мс обычно
	const DEFAULT_DEBOUNCE = 800;
	const [debounceMs, setDebounceMs] = useState<number>(DEFAULT_DEBOUNCE);

	// Текущий активный запрос (чтобы не запускать повторно)
	const activeKeyRef = useRef<RequestKey>("");

	// Swap-индикатор: вернуть дебаунс после завершения
	const swappedOnceRef = useRef<boolean>(false);

	// Translation ID for likes
	const [currentTranslationId, setCurrentTranslationId] = useState<
		string | null
	>(null);

	// ────────────────────────────────────────────────────────────────────────────
	// Translation saving
	// ────────────────────────────────────────────────────────────────────────────
	const saveTranslation = useCallback(
		async (
			sourceText: string,
			resultText: string,
			fromLang: LanguageShort,
			toLang: LanguageShort,
			tone: Tone
		) => {
			try {
				const sessionId = !session?.user?.id
					? crypto.randomUUID().slice(0, 8)
					: undefined;

				const response = await fetch("/api/translations", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						sourceText,
						resultText,
						sourceLang: fromLang,
						targetLang: toLang,
						tone,
						model: "default",
						sessionId,
					}),
				});

				if (response.ok) {
					const data = await response.json();
					setCurrentTranslationId(data.translation.id);
				}
			} catch (error) {
				console.error("Failed to save translation:", error);
			}
		},
		[session?.user?.id]
	);

	// ────────────────────────────────────────────────────────────────────────────
	// Стабильные callbacks для useCompletion
	// ────────────────────────────────────────────────────────────────────────────
	const onFinish = useCallback(
		(prompt: string, completion: string) => {
			activeKeyRef.current = "";
			if (swappedOnceRef.current) {
				swappedOnceRef.current = false;

				setDebounceMs(DEFAULT_DEBOUNCE);
			}
			const sourceText = prompt.trim();
			const resultText = completion.trim();
			// Сохраняем только если есть и исходный текст, и результат, перевод завершен, и мы еще не сохраняли этот перевод
			if (sourceText && resultText) {
				void saveTranslation(
					sourceText,
					resultText,
					fromLang,
					toLang,
					tone
				);
			}
		},
		[fromLang, toLang, tone, saveTranslation]
	);

	const onError = useCallback(() => {
		activeKeyRef.current = "";
		if (swappedOnceRef.current) {
			swappedOnceRef.current = false;
			setDebounceMs(DEFAULT_DEBOUNCE);
		}
	}, []);

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
		onFinish,
		onError,
	});

	const [debouncedInputText] = useDebounce(input, debounceMs);


	// если начался перевод, а юзер сного печататет, останавливаем перевод
	const handleUserInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {

			if (isLoading) {
				stop();
				setCompletion("");
			};

			handleInputChange(e);
		},
		[handleInputChange, isLoading, stop, setCompletion]
	);

	const handleClearInput = useCallback(() => {
		if (isLoading) {
			stop();
		}

		activeKeyRef.current = "";
		setCurrentTranslationId(null);
		setInput("");
		setCompletion("");
	}, [isLoading, stop, setCompletion, setInput]);

	const handleSwapResultToInputText = useCallback(() => {
		const translatedText = completion?.trim() ?? "";
		if (!translatedText) {
			return;
		}
		// Остановим текущий стрим и подготовим новый
		if (isLoading) {
			stop();
			return;
		}

		activeKeyRef.current = "";
		setCurrentTranslationId(null);
		setCompletion("");
		setInput(translatedText);

		// Один немедленный перевод без debounce, потом вернём дефолт
		swappedOnceRef.current = true;
		// setDebounceMs(0);
	}, [completion, isLoading, stop, setCompletion, setInput]);

	// ────────────────────────────────────────────────────────────────────────────
	// Стабильная функция для запуска перевода
	// ────────────────────────────────────────────────────────────────────────────
	const startTranslation = useCallback(
		(
			prompt: string,
			fromLang: LanguageShort,
			toLang: LanguageShort,
			tone: Tone
		) => {
			const key = makeRequestKey(prompt, fromLang, toLang, tone);

			// Если уже стартовали этот же запрос — выходим
			if (activeKeyRef.current === key) return;

			// Обновим ключ до старта, чтобы повторный ререндер не начал второй раз
			activeKeyRef.current = key;

			// Запускаем стрим. Сервер читает body, prompt игнорируется.
			void complete(prompt, {
				body: { fromLang, toLang, tone },
			});
		},
		[complete]
	);

	// ────────────────────────────────────────────────────────────────────────────
	// Оркестратор перевода — без зацикливания
	// ────────────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const prompt = debouncedInputText.trim();

		// Ничего не переводим при пустом вводе
		if (!prompt) return;

		// Нельзя переводить в тот же язык
		if (fromLang === toLang) return;

		// if (input === prompt) {
		// 	stop();
		// 	return;
		// };

		// Сбрасываем ID предыдущего перевода и очищаем кеш сохраненных переводов при начале нового
		setCurrentTranslationId(null);

		startTranslation(prompt, fromLang, toLang, tone);
	}, [debouncedInputText, fromLang, toLang, tone, startTranslation]);

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
		<div className="w-full min-h-[40vh] max-h-content mx-auto space-y-2 md:space-y-3 flex flex-col">
			<LanguageSelector
				isTranslating={isLoading}
				onSwapResultToInputText={handleSwapResultToInputText}
			/>
			<div className="w-full flex-1 grid grid-cols-1 gap-3 md:gap-3 mb-4 md:mb-6 lg:grid-cols-2 bg-gradient-to-t from-red-900/20 to-[90%] from-[#121214] rounded-xl px-3 md:px-3 pb-3 md:pb-3">
				<TextArea
					value={input}
					onChange={handleUserInputChange}
					onClear={handleClearInput}
					className="peer"
					placeholder=" "
					renderCustomPlaceholder={() => (
						<CustomPlaceholder
							showLightBeam={false}
							placeholder="Enter text to translate..."
							value={input}
						/>
					)}
					isInput={true}
					maxLength={100000}
				/>

				<TextArea
					value={displayText}
					// placeholder={placeholder}
					renderCustomPlaceholder={() => (
						<CustomPlaceholder
							showLightBeam={isLoading}
							placeholder={placeholder}
							value={displayText}
						/>
					)}
					isInput={false}
					readOnly={true}
					className={error ? "text-red-400" : ""}
					translationId={currentTranslationId}
					isTranslationComplete={
						!!displayText && !isLoading && !error
					}
				/>
			</div>
		</div>
	);
};
