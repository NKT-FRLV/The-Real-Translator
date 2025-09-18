"use client";

import React from "react";
import { Button } from "@/shared/shadcn/ui/button";
import { Textarea } from "@/shared/shadcn/ui/textarea";
import { cn } from "@/shared/shadcn/utils";

interface GrammarCheckInputProps {
	value: string;
	onChange: (value: string) => void;
	onCheckGrammar: () => void;
	isLoading?: boolean;
	className?: string;
}

export function GrammarCheckInput({
	value,
	onChange,
	onCheckGrammar,
	isLoading = false,
	className,
}: GrammarCheckInputProps) {
	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "/" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			onCheckGrammar();
		}
	};

	return (
		<div className={cn("w-full space-y-3 sm:space-y-4", className)}>
			<div className="relative">
				<Textarea
					value={value}
					onChange={handleTextChange}
					onKeyDown={handleKeyDown}
					placeholder="Enter your text here for grammar checking..."
					className={cn(
						"font-inter",
						"bg-background ring-0 ring-gray-700 focus-visible:ring-1",
						"min-h-[150px] sm:min-h-[200px] w-full resize-none rounded-lg sm:rounded-xl border-2 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base placeholder:text-muted-foreground"
					)}
					disabled={isLoading}
				/>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<p className="font-inter text-xs sm:text-sm text-grammar-text-muted order-2 sm:order-0">
					Press Ctrl + / to check grammar
				</p>

				<Button
					onClick={onCheckGrammar}
					disabled={!value.trim() || isLoading}
					className={cn(
						"min-w-[170px]",
						"font-inter w-full sm:w-auto",
						"bg-foreground text-background hover:bg-foreground/90",
						"h-10 sm:h-9 text-sm sm:text-sm",
						"transition-colors duration-200"
					)}
				>
					{isLoading ? "Checking..." : "Check Grammar"}
				</Button>
			</div>
		</div>
	);
}
