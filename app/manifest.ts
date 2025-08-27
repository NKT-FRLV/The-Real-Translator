import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "The Real Translator",
		short_name: "Translator",
		description:
			"Fast AI-powered translation with custom styles of translation.",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#ffffff",
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any",
			},
			{
				src: "/icon-192-maskable.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-512-maskable.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
		// Splash screen изображения для Android и других платформ
		// iOS использует appleWebApp.startupImage в layout.tsx
		// Эти изображения должны быть точно такого же размера как указано
		// и соответствовать размерам экранов устройств
		categories: ["productivity", "utilities"],
		orientation: "portrait-primary",
		scope: "/",
		lang: "en",
	};
}
