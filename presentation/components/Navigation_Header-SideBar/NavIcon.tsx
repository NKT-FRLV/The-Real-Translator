"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Languages, Clock, Heart, Settings, HelpCircle, Palette, GraduationCap } from "lucide-react";
import { cn } from "@/shared/shadcn/utils";
import Link from "next/link";

type IconsUnion = "languages" | "clock" | "heart" | "settings" | "help" | "theme-demo" | "grammar-check";

type NavIconVariant = "desktop" | "mobile";

interface NavIconProps {
	iconType: IconsUnion;
	href: string;
	className?: string;
	size?: number;
	iconClassName?: string;
	variant?: NavIconVariant;
	label?: string; // для мобильной версии
}

export const NavIcon: React.FC<NavIconProps> = ({
	iconType,
	href,
	className,
	size = 28,
	iconClassName,
	variant = "desktop",
	label,
}) => {

	const IconsMap: Record<IconsUnion, LucideIcon> = {
		languages: Languages,
		clock: Clock,
		heart: Heart,
		settings: Settings,
		help: HelpCircle,
		"theme-demo": Palette,
		"grammar-check": GraduationCap,
	};

	const Icon = IconsMap[iconType];

	// Desktop variant - icon only
	if (variant === "desktop") {
		return (
			<Link
				href={href}
				className={cn(
					"flex items-center justify-center w-10 h-10 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
					className
				)}
			>
				<Icon
					size={size}
					className={cn("text-current", iconClassName)}
				/>
			</Link>
		);
	}

	// Mobile variant - icon with text
	return (
		<Link
			href={href}
			className={cn(
				"w-full flex items-center justify-start gap-3 p-4 h-auto rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
				className
			)}
		>
			<Icon
				size={size}
				className={cn("text-current", iconClassName)}
			/>
			<span>{label}</span>
		</Link>
	);
};

export default NavIcon;
