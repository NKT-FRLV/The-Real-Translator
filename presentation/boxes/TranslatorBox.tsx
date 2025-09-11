// presentation/components/TranslatorBox.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { useDebounce } from "use-debounce";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { TextWindow } from "../elements/Translator-Box/TextWindow";
import BoxTranslateOptions from "../elements/Translator-Box/BoxTranslateOptions";
import { LanguageShort, Tone } from "@/shared/config/translation";
import { useSpeechToText } from "../hooks/useSpeechToText";
// import { createLogger } from "@/shared/utils/logger";
import CustomPlaceholder from "../components/textArea/CustomPlaceholder";
// import {
// 	useFromLang,
// 	useToLang,
// 	useTone,
// 	useSetFromLang,
// 	useSetToLang,
// 	useSetTone,
// } from "../stores/translatorStore";
import {

	useFromLang,
	useToLang,
	useTone,
	// useSetFromLang,
	// useSetToLang,
	// useSetTone,
	// useSwapLanguages,

	useLoadSettings,
	useEffectiveSpeechRecognitionMode,
	useSetSpeechRecognitionMode,
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

// interface TranslatorBoxProps {
// 	defaultSourceLang: LanguageShort;
// 	defaultTargetLang: LanguageShort;
// 	translationStyle: Tone;
// }

export const TranslatorBox: React.FC = () => {
	// ────────────────────────────────────────────────────────────────────────────
	// Store state
	// ────────────────────────────────────────────────────────────────────────────
	// Settings store hooks for loading user preferences
	const fromLang = useFromLang() || "ru";
	const toLang = useToLang() || "en";
	const tone = useTone();

	const { data: session } = useSession();

	const loadSettings = useLoadSettings();

	// Translator store setters
	// const setFromLang = useSetFromLang();
	// const setToLang = useSetToLang();
	// const setTone = useSetTone();
	// const setFromLang = useSetDefaultSourceLang();
	// const setToLang = useSetDefaultTargetLang();
	// const setTone = useSetTranslationStyle();
	const setSpeechRecognitionMode = useSetSpeechRecognitionMode();

	// ────────────────────────────────────────────────────────────────────────────
	// Speech-to-text logic
	// ────────────────────────────────────────────────────────────────────────────

	const isAdmin = session?.user?.role === "ADMIN";
	const speechRecognitionMode = useEffectiveSpeechRecognitionMode(isAdmin);

	const {
		transcript,
		listening,
		isSupported: isSpeechSupported,
		isBrowserSupported: browserSupportsSpeechRecognition,
		isMicrophoneAvailable,
		startListening,
		stopListening,
		resetTranscript,
		isTranscribing,
	} = useSpeechToText({
		language: fromLang,
		mode: speechRecognitionMode || "browser",
		isAdmin,
		onError: (error) => {
			console.error("Speech recognition error:", error);
			// Show user-friendly error message
			if (error.includes("Admin role required")) {
				toast.error("Whisper AI is available only for administrators", {
					description:
						"Switch to browser mode or contact administrator",
				});
			} else if (error.includes("Recording too short")) {
				toast.error("Recording too short", {
					description:
						"Please speak for longer or check your microphone",
				});
			} else if (error.includes("rate limit")) {
				toast.error("Rate limit exceeded", {
					description: "Please wait a moment before trying again",
				});
			} else {
				toast.error("Speech recognition failed", {
					description: error,
				});
			}
		},
	});

	const pendingRef = useRef(false);
	const savedTranslationsRef = useRef<Set<string>>(new Set());

	const handleClickMicroPhone = useCallback(async () => {
		if (pendingRef.current) return;
		pendingRef.current = true;

		try {
			if (!isSpeechSupported || !isMicrophoneAvailable) {
				console.warn("Speech not supported or mic blocked");
				return;
			}

			if (listening) {
				stopListening();
				return;
			}

			// Start listening using the unified hook
			await startListening();
		} finally {
			pendingRef.current = false;
		}
	}, [
		isSpeechSupported,
		isMicrophoneAvailable,
		listening,
		startListening,
		stopListening,
	]);

	// Toggle speech recognition mode (only for admins)
	const handleSpeechModeToggle = useCallback(() => {
		if (!isAdmin) return; // Prevent non-admin users from switching modes

		const newMode =
			speechRecognitionMode === "browser" ? "whisper" : "browser";
		setSpeechRecognitionMode(newMode);

		// Stop current listening if active
		if (listening) {
			stopListening();
		}
		resetTranscript();
	}, [
		isAdmin,
		speechRecognitionMode,
		setSpeechRecognitionMode,
		listening,
		stopListening,
		resetTranscript,
	]);

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
	// useEffect(() => {
	// 	if (defaultSourceLang) {
	// 		setFromLang(defaultSourceLang);
	// 	}
	// 	if (defaultTargetLang) {
	// 		setToLang(defaultTargetLang);
	// 	}
	// 	if (defaultTranslationStyle) {
	// 		setTone(defaultTranslationStyle);
	// 	}
	// 	// Speech recognition mode is handled by the settings store directly
	// 	// and used via speechRecognitionMode state
	// }, [
	// 	defaultSourceLang,
	// 	defaultTargetLang,
	// 	defaultTranslationStyle,
	// 	setFromLang,
	// 	setToLang,
	// 	setTone,
	// ]);

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

	const safeTranscript = typeof transcript === "string" ? transcript : "";

	useEffect(() => {
		// синкаем transcript с input при любом изменении transcript
		// но только если transcript не пустой
		if (safeTranscript && safeTranscript !== input) {
			setInput(safeTranscript);
		}
	}, [safeTranscript, setInput, input]);

	// если начался перевод, а юзер сного печататет, останавливаем перевод
	const handleUserInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (isLoading) {
				stop();
				setCompletion("");
			}

			handleInputChange(e);
		},
		[handleInputChange, isLoading, stop, setCompletion]
	);

	const handleClearInput = useCallback(() => {
		if (isLoading) {
			stop();
		}

		activeKeyRef.current = "";
		stopListening();
		setCurrentTranslationId(null);
		setInput("");
		resetTranscript();
		setCompletion("");
	}, [
		isLoading,
		stop,
		setCompletion,
		setInput,
		resetTranscript,
		stopListening,
	]);

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
		resetTranscript();
		stopListening();
		setCurrentTranslationId(null);
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
		resetTranscript,
		stopListening,
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
	// Auto-save completed translations
	// ────────────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const sourceText = input.trim();
		const resultText = completion.trim();

		// Создаем уникальный ключ для этого перевода
		const translationKey = `${sourceText}|${resultText}|${fromLang}|${toLang}|${tone}`;

		// Сохраняем только если есть и исходный текст, и результат, перевод завершен, и мы еще не сохраняли этот перевод
		if (
			sourceText &&
			resultText &&
			!isLoading &&
			!error &&
			!savedTranslationsRef.current.has(translationKey)
		) {
			savedTranslationsRef.current.add(translationKey);
			void saveTranslation(
				sourceText,
				resultText,
				fromLang,
				toLang,
				tone
			);
		}
	}, [
		completion,
		isLoading,
		error,
		input,
		fromLang,
		toLang,
		tone,
		saveTranslation,
	]);

	// ────────────────────────────────────────────────────────────────────────────
	// Оркестратор перевода — без зацикливания
	// ────────────────────────────────────────────────────────────────────────────
	useEffect(() => {
		const prompt = debouncedInputText.trim();

		// Ничего не переводим при пустом вводе
		if (!prompt) return;

		// Нельзя переводить в тот же язык
		if (fromLang === toLang) return;

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
		<div className="w-full min-h-[40vh] mx-auto space-y-3 md:space-y-4 flex flex-col">
			<BoxTranslateOptions
				isTranslating={isLoading}
				onSwapResultToInputText={handleSwapResultToInputText}
			/>
			<div className="w-full grid grid-cols-1 gap-4 md:gap-5 mb-6 md:mb-8 lg:grid-cols-2 backdrop-blur-md bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.08] dark:border-white/[0.06] rounded-2xl p-4 md:p-5 shadow-xl shadow-black/[0.15]">
				<TextWindow
					value={input}
					onChange={handleUserInputChange}
					onClear={handleClearInput}
					className="peer"
					placeholder=" "
					renderCustomPlaceholder={() => (
						<CustomPlaceholder
							showLightBeam={false}
							placeholder="Enter text to translate..."
							value={transcript || input}
						/>
					)}
					isInput={true}
					maxLength={100000}
					isSpeechSupported={isSpeechSupported}
					isBrowserSupportSpeech={browserSupportsSpeechRecognition}
					onVoiceInput={handleClickMicroPhone}
					listening={listening}
					speechMode={speechRecognitionMode}
					onSpeechModeToggle={handleSpeechModeToggle}
					isAdmin={isAdmin}
					isTranscribing={isTranscribing}
				/>

				<TextWindow
					value={displayText}
					canLike={!!session?.user?.id}
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
					listening={false}
				/>
			</div>
		</div>
	);
};
