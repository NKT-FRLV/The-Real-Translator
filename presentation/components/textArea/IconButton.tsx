"use client";

import React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/shared/shadcn/ui/tooltip";
import { cn } from "@/shared/shadcn/";

interface IconButtonProps {
	icon: LucideIcon;
	onClick?: () => void;
	tip?: string;
	disabled?: boolean;
	isActive?: boolean;
	className?: string;
	size?: "big" | "small";
	isLoading?: boolean;
	iconClassName?: string;
	tooltipDelay?: number;
}

export const IconButton: React.FC<IconButtonProps> = ({
	icon: Icon,
	onClick,
	tip,
	disabled = false,
	isActive = false,
	className = "",
	size = "small",
	isLoading = false,
	iconClassName = "",
	tooltipDelay = 300,
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
						isActive && "text-red-500 fill-red-500",
						iconClassName
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
			<Tooltip delayDuration={tooltipDelay}>
				<TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
				<TooltipContent side="bottom">{tip}</TooltipContent>
			</Tooltip>
		);
	}

	return buttonContent;
};
