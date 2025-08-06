"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/shared/shadcn/ui/button";
import { cn } from "@/shared/shadcn/utils";

function ThemeSwitcher({
	className,
}: {
	className?: string;
}) {
	const { theme, setTheme } = useTheme();

	console.log(theme);
	const handleThemeChange = (theme: "light" | "dark" | "system") => {
		setTheme(theme);
	};

	return (
		<div
			className={cn(
				"h-8 w-8 md:h-12 md:w-12 flex items-center justify-center",
				className
			)}
		>
			<Button
				className="h-full w-full"
				variant="outline"
				size="icon"
				onClick={() =>
					handleThemeChange(theme === "light" ? "dark" : "light")
				}
			>
				<Sun className="h-[1.3rem] w-[1.3rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
				<Moon className="absolute h-[1.3rem] w-[1.3rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		</div>
	);
}

export default ThemeSwitcher;
