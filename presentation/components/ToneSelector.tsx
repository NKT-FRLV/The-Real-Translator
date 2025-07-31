// import React from "react";
import { toneStyle } from "@/shared/constants/tone-style";
import {  Tone } from "@/shared/types/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/shadcn/ui/select";
import { cn } from "@/shared/shadcn/";

interface ToneSelectorProps {
	value: Tone;
	className?: string;
	onToneChange: (value: Tone) => void;
}

const ToneSelector = ({ value, className, onToneChange }: ToneSelectorProps) => {
	return (
		<Select value={value} onValueChange={onToneChange}>
			<SelectTrigger size="max" className={cn("flex justify-center text-gray-300 font-semibold text-sm md:text-xl bg-transparent border-none focus:ring-0 hover:bg-gray-700", className)} icon={false}>
				<SelectValue placeholder="Select a Tone" />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(toneStyle).map(([key, label]) => (
					<SelectItem key={key} value={key} className="font-medium text-sm md:text-xl">
						{label[0].toUpperCase() + label.slice(1)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default ToneSelector;
