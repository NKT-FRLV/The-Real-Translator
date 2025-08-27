"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";
import { Languages, Clock, Heart, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/shared/shadcn/utils";
import {
	NavigationMenuTrigger,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
} from "@/shared/shadcn/ui/navigation-menu";

type IconsUnion = "languages" | "clock" | "heart" | "settings" | "help";

type NavIconVariant = "desktop" | "mobile";

interface NavIconProps {
	iconType: IconsUnion;
	menuItems: Array<{
		label: string;
		onClick?: () => void;
		href?: string;
	}>;
	className?: string;
	size?: number;
	iconClassName?: string;
	variant?: NavIconVariant;
	label?: string; // для мобильной версии
}

export const NavIcon: React.FC<NavIconProps> = ({
	iconType,
	menuItems,
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
	};

	const Icon = IconsMap[iconType];

	// Desktop variant - icon only
	if (variant === "desktop") {
		return (
			<NavigationMenuItem>
				<NavigationMenuTrigger
					chevron={false}
					className={cn(
						"flex items-center justify-center w-10 h-10 p-0 rounded-lg",
						className
					)}
				>
					<Icon
						size={size}
						className={cn("text-current", iconClassName)}
					/>
				</NavigationMenuTrigger>
				<NavigationMenuContent>
					<div className="w-48 p-2">
						{menuItems.map((item, index) => (
							<NavigationMenuLink
								key={index}
								className="block p-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer"
								onClick={item.onClick}
							>
								{item.label}
							</NavigationMenuLink>
						))}
					</div>
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	}

	// Mobile variant - icon with text
	return (
		<NavigationMenuItem className="w-full">
			<NavigationMenuTrigger 
				className={cn(
					"w-full justify-start gap-3 p-4 h-auto",
					className
				)}
			>
				<Icon
					size={size}
					className={cn("text-current", iconClassName)}
				/>
				<span>{label}</span>
			</NavigationMenuTrigger>
			<NavigationMenuContent>
				<div className="w-full p-2">
					{menuItems.map((item, index) => (
						<NavigationMenuLink
							key={index}
							className="block p-3 text-sm hover:bg-gray-800 rounded cursor-pointer"
							onClick={item.onClick}
						>
							{item.label}
						</NavigationMenuLink>
					))}
				</div>
			</NavigationMenuContent>
		</NavigationMenuItem>
	);
};

export default NavIcon;
