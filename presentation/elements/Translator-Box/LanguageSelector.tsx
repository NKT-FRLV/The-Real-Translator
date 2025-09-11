// import React from "react";
import { languages } from "@/shared/constants/languages";
import { LanguageShort } from "@/shared/types/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/shadcn/ui/select";
import { cn } from "@/shared/shadcn/utils";

interface LanguageSelectProps {
	disabledValue: LanguageShort;
	value: LanguageShort;
	className?: string;
	setValue: (value: LanguageShort) => void;
}

const LanguageSelector = ({
	disabledValue,
	value,
	className,
	setValue,
}: LanguageSelectProps) => {


	return (
		<Select value={value} onValueChange={setValue}>
			<SelectTrigger
				size="max"
				className={cn(
					"flex justify-center font-orbitron p-1 text-foreground font-bold text-sm md:text-xl bg-transparent border-none focus:ring-0 hover:bg-background-hover transition-colors duration-300",
					className
				)}
				icon={false}
				disabled={disabledValue === value}
			>
				<SelectValue placeholder="Select a language" />
			</SelectTrigger>
			<SelectContent>
				{Object.values(languages).map((language) => (
					<SelectItem
						key={language.code}
						value={language.code}
						disabled={disabledValue === language.code}
						className="font-medium text-lg"
					>
						{language.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default LanguageSelector;
