"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

import { ThemeToggleButton, useThemeTransition } from "@/shared/shadcn/ui/theme-toggle-button";
import { cn } from "@/shared/shadcn/utils";

function ThemeSwitcher({
	className,
}: {
	className?: string;
}) {
	const { theme, setTheme } = useTheme();
	const { startTransition } = useThemeTransition();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleThemeToggle = useCallback(() => {
		const newTheme = theme === "dark" ? "light" : "dark";
		
		startTransition(() => {
			setTheme(newTheme);
		});
	}, [theme, setTheme, startTransition]);

	const currentTheme = theme === "system" ? "light" : (theme as "light" | "dark") || "light";

	if (!mounted) {
		return (
			<div
				className={cn(
					"h-8 w-8 md:h-12 md:w-12 flex items-center justify-center",
					className
				)}
			>
				<div className="h-full w-full border border-border rounded-md animate-pulse" />
			</div>
		);
	}

	return (
		<div
			className={cn(
				"h-8 w-8 md:h-12 md:w-12 flex items-center justify-center",
				className
			)}
		>
			<ThemeToggleButton
				theme={currentTheme}
				onClick={handleThemeToggle}
				variant="circle-blur"
				start="top-right"
				className="h-full w-full"
			/>
		</div>
	);
}

export default ThemeSwitcher;
