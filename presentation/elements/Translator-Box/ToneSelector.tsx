import React from "react";
import { toneStyle } from "@/shared/constants/tone-style";
import { Tone } from "@/shared/types/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/shadcn/ui/select";
import { cn } from "@/shared/shadcn/";
import { useTone, useSetTone } from "@/presentation/stores/translatorStore";

interface ToneSelectorProps {
	value?: Tone;
	className?: string;
	onToneChange?: (value: Tone) => void;
	useStore?: boolean;
}

const ToneSelector = ({
	value,
	className,
	onToneChange,
	useStore = false,
}: ToneSelectorProps) => {
	const tone = useTone();
	const setTone = useSetTone();

	// Используем стор если useStore = true, иначе пропсы
	const currentTone = useStore ? tone : value || "neutral";
	const handleToneChange = useStore ? setTone : onToneChange || (() => {});
	return (
		<Select value={currentTone} onValueChange={handleToneChange}>
			<SelectTrigger
				size="max"
				className={cn(
					"flex justify-center text-foreground font-semibold text-sm md:text-xl bg-transparent border-none focus:ring-0 hover:bg-background-hover transition-colors duration-300",
					className
				)}
				icon={false}
			>
				<SelectValue placeholder="Select a Tone" />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(toneStyle).map(([key, label]) => (
					<SelectItem
						key={key}
						value={key}
						className="font-medium text-sm md:text-xl"
					>
						{label[0].toUpperCase() + label.slice(1)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ToneSelector;
