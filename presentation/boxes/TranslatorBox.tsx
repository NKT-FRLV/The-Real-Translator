// presentation/components/TranslatorBox.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { useDebounce } from "use-debounce";
import { TextArea } from "../elements/Translator-Box/TextArea";
import LanguageSelector from "../elements/Translator-Box/BoxTranslateOptions";
import { LanguageShort, Tone } from "@/shared/types/types";
// import { createLogger } from "@/shared/utils/logger";
import CustomPlaceholder from "../components/textArea/CustomPlaceholder";
import { useFromLang, useToLang, useTone } from "../stores/translatorStore";

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

	// ────────────────────────────────────────────────────────────────────────────
	// UI state
	// ────────────────────────────────────────────────────────────────────────────

	// Дебаунс: 0 мс сразу после swap, 800 мс обычно
	const DEFAULT_DEBOUNCE = 800;
	const [debounceMs, setDebounceMs] = useState<number>(DEFAULT_DEBOUNCE);

	// Текущий активный запрос (чтобы не запускать повторно)
	const activeKeyRef = useRef<RequestKey>("");

	// Swap-индикатор: вернуть дебаунс после завершения
	const swappedOnceRef = useRef<boolean>(false);

	// ────────────────────────────────────────────────────────────────────────────
	// Стабильные callbacks для useCompletion
	// ────────────────────────────────────────────────────────────────────────────
	const onFinish = useCallback(() => {
		activeKeyRef.current = "";
		if (swappedOnceRef.current) {
			swappedOnceRef.current = false;
			setDebounceMs(DEFAULT_DEBOUNCE);
		}
	}, []);

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

	const handleClearInput = useCallback(() => {

		if (isLoading) {
			stop();
		}

		activeKeyRef.current = "";
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
		setCompletion("");
		setInput(translatedText);

		// Один немедленный перевод без debounce, потом вернём дефолт
		swappedOnceRef.current = true;
		// setDebounceMs(0);
	}, [
		completion,
		isLoading,
		stop,
		setCompletion,
		setInput,
	]);

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
					onChange={handleInputChange}
					onClear={handleClearInput}
					className="peer"
					placeholder=" "
					renderCustomPlaceholder={
						() => (
							<CustomPlaceholder
								showLightBeam={false}
								placeholder="Enter text to translate..."
								value={input}
							/>
						)
					}
					isInput={true}
					maxLength={100000}
				/>

				<TextArea
					value={displayText}
					// placeholder={placeholder}
					renderCustomPlaceholder={
						() => (
							<CustomPlaceholder
								showLightBeam={isLoading}
								placeholder={placeholder}
								value={displayText}
							/>
						)
					}
					isInput={false}
					readOnly={true}
					className={error ? "text-red-400" : ""}
				/>
			</div>
		</div>
	);
};
