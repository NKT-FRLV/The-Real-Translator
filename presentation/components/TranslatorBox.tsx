"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { TextArea } from "./TextArea";
import LanguageSelector from "./LanguageSelector";
import { useStreamingTranslation } from "@/presentation/hooks/useStreamingTranslation";
import { LanguageShort, Tone } from "@/shared/types/types";
import { useDebounce } from "use-debounce";
import { toneStyle } from "@/shared/constants/tone-style";

export const TranslatorBox: React.FC = () => {
	//  Users Input for translation
	const isSwapped = useRef(false);
	const [inputText, setInputText] = useState("");
	const [debouncedInputText] = useDebounce(inputText, isSwapped.current ? 0 : 1000);

	//  Chosen tone(style) for translation
	const [tone, setTone] = useState<Tone>(toneStyle.natural);

	//  Chosen languages for translation
	const [fromLang, setFromLang] = useState<LanguageShort>("ru");
	const [toLang, setToLang] = useState<LanguageShort>("es");

	const {
		translate,
		cancel,
		reset,
		isStreaming,
		result,
		error,
		// metrics
	} = useStreamingTranslation();

	const handleSwapResultToInputText = useCallback(
		(translatedText: string) => {
			setInputText(translatedText);
			isSwapped.current = true;
			},
		[setInputText]
	);

	const handleInputChange = useCallback(
		(text: string) => {
			cancel();
			setInputText(text);
		},
		[cancel]
	);

	const handleClearInput = useCallback(() => {
		setInputText("");
		reset();
		cancel()
		
	}, [reset, cancel]);

	const handleLanguageChange = useCallback(
		(from: LanguageShort, to: LanguageShort) => {
			setFromLang(from);
			setToLang(to);
		},
		[]
	);

	const handleTranslate = useCallback(async () => {
		if (!debouncedInputText.trim()) return;
		if (isSwapped.current) isSwapped.current = false;

		await translate(debouncedInputText, {
			fromLang,
			toLang,
			tone,
		});
	}, [debouncedInputText, fromLang, toLang, tone, translate]);

	useEffect(() => {
		handleTranslate();
	}, [debouncedInputText, handleTranslate]);


	return (
		<div className="w-full min-h-[50vh] max-h-screen mx-auto space-y-2 md:space-y-4 flex flex-col">
			{/* Language Selector */}
			<LanguageSelector
				fromLang={fromLang}
				toLang={toLang}
				tone={tone}
				onToneChange={setTone}
				onLanguageChange={handleLanguageChange}
				onSwapResultToInputText={() =>
					handleSwapResultToInputText(result)
				}
			/>

			{/* Translation Interface */}
			<div className="w-full flex-1 grid grid-cols-1 gap-3 md:gap-4 mb-4 md:mb-8 lg:grid-cols-2 bg-gradient-to-t from-red-900/20 to-[90%] from-[#121214] rounded-xl px-3 md:px-4 pb-3 md:pb-4">
				<TextArea
					value={inputText}
					onChange={handleInputChange}
					onClear={handleClearInput}
					placeholder="Enter text to translate..."
					isInput={true}
					maxLength={10000}
				/>

				<TextArea
					value={error || result}
					placeholder={
						isStreaming
							? "Translating..."
							: error
							? "Error occurred"
							: "Translation will appear here..."
					}
					isInput={false}
					readOnly={true}
					className={error ? "text-red-400" : ""}
				/>
			</div>
		</div>
	);
};
