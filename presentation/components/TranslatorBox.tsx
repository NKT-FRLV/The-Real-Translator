"use client";
import React, { useState, useCallback, useEffect } from "react";
import { TextArea } from "./TextArea";
import LanguageSelector from "./LanguageSelector";
import { useStreamingTranslation } from "@/presentation/hooks/useStreamingTranslation";
import { LanguageShort, Tone } from "@/shared/types/types";
import { useDebounce } from "use-debounce";
import { toneStyle } from "@/shared/constants/tone-style";

export const TranslatorBox: React.FC = () => {

	//  Users Input for translation
	const [inputText, setInputText] = useState("");
	const [debouncedInputText] = useDebounce(inputText, 1000);

	//  Chosen tone(style) for translation
	const [tone, setTone] = useState<Tone>(toneStyle.natural);

	//  Chosen languages for translation
	const [fromLang, setFromLang] = useState<LanguageShort>("en");
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
		},
		[]
	);

	const handleInputChange = useCallback((text: string) => {
		cancel();
		setInputText(text);
	}, [cancel]);

	const handleClearInput = useCallback(() => {
		setInputText("");
		reset();
		cancel();
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

		await translate(debouncedInputText, {
			fromLang,
			toLang,
			tone,
		});
	}, [debouncedInputText, fromLang, toLang, tone, translate]);

	useEffect(() => {
		handleTranslate();
	}, [debouncedInputText, handleTranslate]);

	const handleCancel = useCallback(() => {
		cancel();
	}, [cancel]);

	// ✅ Format metrics for display
	//   const formatMetrics = () => {
	//     if (!metrics.ttft && !metrics.totalTime) return null;

	//     const parts = [];
	//     if (metrics.ttft) parts.push(`First token: ${metrics.ttft}ms`);
	//     if (metrics.tokensPerSecond) parts.push(`Speed: ${metrics.tokensPerSecond} tok/s`);
	//     if (metrics.totalTime) parts.push(`Total: ${metrics.totalTime}ms`);

	//     return parts.join(' • ');
	//   };

	return (
		<div className="w-full min-h-[50vh] max-h-screen mx-auto space-y-4 flex flex-col">
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
			<div className="flex-1 grid grid-cols-1 gap-4 mb-8 lg:grid-cols-2 w-full bg-gradient-to-t from-red-900/20 to-[90%] from-[#121214] rounded-4xl px-4 pb-4">
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

				{/* Action Buttons */}
				{/* <div className="col-span-2 flex gap-2 items-center">
          <button 
            onClick={handleTranslate}
            disabled={isStreaming || !inputText.trim()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? '🔄 Translating...' : '🌍 Translate'}
          </button>
          
          {isStreaming && (
            <button 
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              ✋ Cancel
            </button>
          )}
          
          {(result || error) && !isStreaming && (
            <button 
              onClick={reset}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              🗑️ Clear
            </button>
          )}
        </div> */}

				{/* Performance Metrics */}
				{/* {formatMetrics() && (
          <div className="col-span-2 text-sm text-gray-400 text-center py-2 border-t border-gray-700">
            📊 Performance: {formatMetrics()}
            {metrics.tokenCount && (
              <span className="ml-2">• {metrics.tokenCount} tokens</span>
            )}
          </div>
        )} */}
			</div>
		</div>
	);
};
