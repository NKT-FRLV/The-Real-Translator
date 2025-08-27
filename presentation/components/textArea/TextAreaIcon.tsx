"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/shared/shadcn/ui/tooltip";

interface TextAreaIconProps {
	icon: LucideIcon;
	onClick?: () => void;
	tip?: string;
	disabled?: boolean;
	isActive?: boolean;
	className?: string;
	size?: "big" | "small";
}

export const TextAreaIcon: React.FC<TextAreaIconProps> = ({
	icon: Icon,
	onClick,
	tip,
	disabled = false,
	isActive = false,
	className = "",
	size = "small",
}) => {
	const iconSizes = {
		big: "w-5 h-5 md:w-7 md:h-7",
		small: "w-3.5 h-3.5 md:w-4 md:h-4",
	};
	const buttonContent = (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors ${
				isActive ? "bg-blue-600 hover:bg-blue-700" : ""
			} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
		>
			<Icon
				size={undefined}
				className={`${iconSizes[size]} ${
					isActive ? "text-red-500" : "text-gray-400"
				}`}
			/>
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
