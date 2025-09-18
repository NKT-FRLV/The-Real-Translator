"use client";

import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectLabel,
	SelectGroup,
} from "@/shared/shadcn/ui/select";
import { cn } from "@/shared/shadcn/utils";

export type EditingStyle =
	| "neutral"
	| "formal"
	| "informal"
	| "influencer"
	| "pirate"
	| "elf"
	| "academic"
	| "casual"
	| "professional";

interface StyleSelectorProps {
	value: EditingStyle;
	onValueChange: (value: EditingStyle) => void;
	className?: string;
}

const editingStyles = [
	{
		value: "neutral" as const,
		label: "Neutral",
		description: "Standard, balanced tone",
	},
	{
		value: "formal" as const,
		label: "Formal",
		description: "Professional and academic",
	},
	{
		value: "informal" as const,
		label: "Informal",
		description: "Casual and conversational",
	},
	{
		value: "influencer" as const,
		label: "Influencer",
		description: "Trendy and engaging",
	},
	{
		value: "pirate" as const,
		label: "Pirate",
		description: "Arrr, matey! Pirate speak",
	},
	{
		value: "elf" as const,
		label: "Elf",
		description: "Elegant and mystical",
	},
	{
		value: "academic" as const,
		label: "Academic",
		description: "Scholarly and precise",
	},
	{
		value: "casual" as const,
		label: "Casual",
		description: "Relaxed and friendly",
	},
	{
		value: "professional" as const,
		label: "Professional",
		description: "Business-appropriate",
	},
];

export default function StyleSelector({
	value,
	onValueChange,
	className,
}: StyleSelectorProps) {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<span className="text-xs sm:text-sm font-medium text-grammar-text">
				Editing Style
			</span>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger size="max" className="w-full text-xs sm:text-sm">
					<SelectValue placeholder="Select editing style" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel className="text-xs sm:text-sm font-medium text-grammar-text">
							Styles
						</SelectLabel>
						{editingStyles.map((style) => (
							<SelectItem key={style.value} value={style.value}>
								<div className="flex flex-col gap-1">
									<span className="font-medium text-xs sm:text-sm">
										{style.label}
									</span>
									<span className="text-xs text-grammar-text-muted">
										{style.description}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
