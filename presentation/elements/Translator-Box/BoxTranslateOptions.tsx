"use client";

import { ArrowLeftRight } from "lucide-react";
import LanguageSelect from "./LanguageSelector";
import ToneSelector from "./ToneSelector";
import { Button } from "@/shared/shadcn/ui/button";
import { LanguageShort, Tone } from '@/shared/types/types'
import { memo } from "react";
import { useFromLang, useToLang, useSetFromLang, useSetToLang, useSwapLanguages, useTone, useSetTone } from "../../stores/translatorStore";

interface BoxTranslateOptionsProps {
	initialFromLang?: LanguageShort;
	initialToLang?: LanguageShort;
	initialTone?: Tone;
	isTranslating: boolean;
	onSwapResultToInputText: () => void;
}

const BoxTranslateOptions: React.FC<BoxTranslateOptionsProps> = memo(({
	initialFromLang,
	initialToLang,
	initialTone,
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
				<div className="flex w-full h-full items-center gap-0 md:gap-4 truncate">
					<LanguageSelect
						value={fromLang}
						setValue={setFromLang}
						disabledValue={initialFromLang || toLang}
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
					<div className="h-full flex flex-1 items-center gap-2 md:gap-3">
						<LanguageSelect
							value={toLang}
							setValue={setToLang}
							disabledValue={initialToLang || fromLang}
							className="flex-1"
						/>
						<div className="h-3/4 w-[1px] bg-border/50"></div>
						<div className="relative flex flex-col items-center justify-center h-full">
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10 rounded-md blur-sm"></div>
								<div className="relative bg-white/[0.03] dark:bg-white/[0.02] border border-red-500/20 dark:border-red-400/15 rounded-md px-2 py-1 backdrop-blur-sm">
									<ToneSelector value={initialTone || tone} onToneChange={setTone} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

BoxTranslateOptions.displayName = "BoxTranslateOptions";

export default BoxTranslateOptions;
