"use client";

import React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/shared/shadcn/ui/tooltip";
import { cn } from "@/shared/shadcn/";

interface TextAreaIconProps {
	icon: LucideIcon;
	onClick?: () => void;
	tip?: string;
	disabled?: boolean;
	isActive?: boolean;
	className?: string;
	size?: "big" | "small";
	isLoading?: boolean;
}

export const TextAreaIcon: React.FC<TextAreaIconProps> = ({
	icon: Icon,
	onClick,
	tip,
	disabled = false,
	isActive = false,
	className = "",
	size = "small",
	isLoading = false,
}) => {
	const iconSizes = {
		big: "w-5 h-5 md:w-7 md:h-7",
		small: "w-3.5 h-3.5 md:w-4 md:h-4",
	};

	const buttonContent = (
		<button
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors",
				disabled ? "opacity-50 cursor-not-allowed" : "",
				className
			)}
		>
			{!isLoading ? (
				<Icon
					size={undefined}
					className={cn(
						iconSizes[size],
						"text-foreground",
						isActive && "text-red-500 fill-red-500"
					)}
				/>
			) : (
				<Loader2
					className={cn(iconSizes[size], "animate-spin")}
					size={undefined}
				/>
			)}
		</button>
	);

	if (tip) {
		return (
			<Tooltip>
				<TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
				<TooltipContent side="bottom">{tip}</TooltipContent>
			</Tooltip>
		);
	}

	return buttonContent;
};
