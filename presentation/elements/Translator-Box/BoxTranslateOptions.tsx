"use client";

import { ArrowLeftRight } from "lucide-react";
import LanguageSelect from "./LanguageSelector";
import ToneSelector from "./ToneSelector";
import { Button } from "@/shared/shadcn/ui/button";
import { memo } from "react";
import { useFromLang, useToLang, useSetFromLang, useSetToLang, useSwapLanguages, useTone, useSetTone } from "../../stores/translatorStore";

interface BoxTranslateOptionsProps {
	isTranslating: boolean;
	onSwapResultToInputText: () => void;
}

const BoxTranslateOptions: React.FC<BoxTranslateOptionsProps> = memo(({
	isTranslating,
	onSwapResultToInputText,
}) => {
	const fromLang = useFromLang();
	const toLang = useToLang();
	const setFromLang = useSetFromLang();
	const setToLang = useSetToLang();
	const swapLanguages = useSwapLanguages();
	const tone = useTone();
	const setTone = useSetTone();

	const handleSwapLanguages = () => {
		if (isTranslating) return;
		swapLanguages(fromLang, toLang);
		onSwapResultToInputText();
	};

	return (
		<div className="px-3 pt-3 md:px-4 w-full rounded-lg bg-gradient-to-b from-red-900/10 to-[90%] from-[#121214]">
			<div className="flex h-16 md:h-18 items-center justify-start border border-gray-700 bg-accent/30 px-3 md:px-6 py-2 rounded-lg">
				<div className="flex w-full h-full items-center gap-2 md:gap-4">
					<LanguageSelect
						value={fromLang}
						setValue={setFromLang}
						disabledValue={toLang}
						className="flex-1"
					/>
					<Button
						variant="ghost"
						size="icon"
						className="h-full text-foreground min-w-[40px] md:min-w-[80px] hover:bg-background-hover transition-colors duration-300"
						onClick={handleSwapLanguages}
					>
						<ArrowLeftRight
							height={32}
							width={16}
							className="text-foreground stroke-2 size-4 md:size-6"
						/>
					</Button>
					<div className="w-full h-full flex flex-1 items-center">
						<LanguageSelect
							value={toLang}
							setValue={setToLang}
							disabledValue={fromLang}
							className="flex-1"
						/>
						<div className="text-xs p-0 md:text-base md:mx-2 h-full w-[1px] bg-foreground"></div>
						<ToneSelector value={tone} onToneChange={setTone} />
					</div>
				</div>
			</div>
		</div>
	);
});

BoxTranslateOptions.displayName = "BoxTranslateOptions";

export default BoxTranslateOptions;
