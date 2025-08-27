"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function PWAThemeManager() {
	const { theme, systemTheme } = useTheme();

	useEffect(() => {
		// Определяем текущую тему
		const currentTheme = theme === "system" ? systemTheme : theme;
		
		// Цвета для светлой и темной темы
		const colors = {
			light: {
				background: "#000000",
				theme: "#000000",
				statusBar: "black-translucent"
			},
			dark: {
				background: "#000000", 
				theme: "#000000",
				statusBar: "black-translucent"
			}
		};

		const themeColors = colors[currentTheme as keyof typeof colors] || colors.light;

		// Обновляем мета-теги для PWA
		const updateMetaTag = (name: string, content: string) => {
			let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
			if (!meta) {
				meta = document.createElement("meta");
				meta.name = name;
				document.head.appendChild(meta);
			}
			meta.content = content;
		};

		// Обновляем theme-color
		let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
		if (!themeColorMeta) {
			themeColorMeta = document.createElement("meta");
			themeColorMeta.name = "theme-color";
			document.head.appendChild(themeColorMeta);
		}
		themeColorMeta.content = themeColors.theme;

		// Обновляем мета-теги для iOS
		updateMetaTag("apple-mobile-web-app-status-bar-style", themeColors.statusBar);
		updateMetaTag("msapplication-navbutton-color", themeColors.theme);
		updateMetaTag("msapplication-TileColor", themeColors.background);

		// Обновляем CSS переменную для фона body (для случаев когда PWA загружается)
		document.documentElement.style.setProperty("--pwa-background", themeColors.background);
		
	}, [theme, systemTheme]);

	return null;
}
