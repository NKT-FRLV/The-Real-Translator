"use client";

import { ArrowLeftRight } from "lucide-react";
import LanguageSelect from "./LanguageSelect";
import ToneSelector from "./ToneSelector";
import { Button } from "@/shared/shadcn/ui/button";
import { LanguageShort, Tone } from "@/shared/types/types";
import { useState, useEffect } from "react";
import { toneStyle } from "@/shared/constants/tone-style";

interface LanguageSelectorProps {
	fromLang?: LanguageShort;
	toLang?: LanguageShort;
	tone?: Tone;
	onToneChange: (tone: Tone) => void;
	onLanguageChange?: (fromLang: LanguageShort, toLang: LanguageShort) => void;
	onSwapResultToInputText?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	fromLang = "en",
	toLang = "es",
	tone = toneStyle.natural,
	onToneChange,
	onLanguageChange,
	onSwapResultToInputText,
}) => {
	const [fromLanguage, setFromLanguage] = useState<LanguageShort>(fromLang);
	const [toLanguage, setToLanguage] = useState<LanguageShort>(toLang);
	// const [tone, setTone] = useState<Tone>(toneStyle.natural);

	// ✅ Notify parent when languages change
	useEffect(() => {
		onLanguageChange?.(fromLanguage, toLanguage);
		onToneChange?.(tone);
	}, [fromLanguage, toLanguage, tone, onLanguageChange, onToneChange]);

	const handleSwapLanguages = () => {
		const temp = fromLanguage;
		setFromLanguage(toLanguage);
		setToLanguage(temp);
		onSwapResultToInputText?.();
	};

	return (
		<div className="px-3 md:px-4 w-full">
			<div className="flex h-16 md:h-18 items-center justify-start border-b border-gray-700 bg-myCard px-3 md:px-6 py-2 rounded-lg">
				<div className="flex w-full h-full items-center gap-2 md:gap-4">
					<LanguageSelect
						value={fromLanguage}
						setValue={setFromLanguage}
						disabledValue={toLanguage}
						className="flex-1 text-foreground"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="h-full text-foreground min-w-[40px] md:min-w-[80px] hover:bg-gray-700"
						onClick={handleSwapLanguages}
					>
						<ArrowLeftRight
							height={32}
							width={16}
							className="text-gray-400 text-foreground stroke-2 size-4 md:size-6"
						/>
					</Button>
					<div className="w-full h-full flex flex-1 items-center">
						<LanguageSelect
							value={toLanguage}
							setValue={setToLanguage}
							disabledValue={fromLanguage}
							className="flex-1 text-foreground"
						/>
						<div className="text-xs p-0 md:text-base md:mx-2 h-full w-[1px] bg-foreground"></div>
						<ToneSelector value={tone} onToneChange={onToneChange} className="text-foreground" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default LanguageSelector;
