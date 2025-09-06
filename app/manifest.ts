import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "The Real Translator",
		short_name: "Translator",
		description:
			"Fast AI-powered translation with custom styles of translation.",
		start_url: "/",
		display: "standalone",
		background_color: "#0b0b0b",
		theme_color: "#0b0b0b",
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
		screenshots: [
			{
				src: "/splash-640x1136.png",
				sizes: "640x1136",
				type: "image/png",
				form_factor: "narrow",
				label: "Splash Screen - iPhone SE",
			},
			{
				src: "/splash-750x1334.png",
				sizes: "750x1334",
				type: "image/png",
				form_factor: "narrow",
				label: "Splash Screen - iPhone 6/7/8",
			},
			{
				src: "/splash-1242x2688.png",
				sizes: "1242x2688",
				type: "image/png",
				form_factor: "narrow",
				label: "Splash Screen - iPhone X/XS/11 Pro",
			},
			{
				src: "/splash-1536x2048.png",
				sizes: "1536x2048",
				type: "image/png",
				form_factor: "wide",
				label: "Splash Screen - iPad",
			},
		],
		categories: ["productivity", "utilities"],
		orientation: "portrait-primary",
		scope: "/",
		lang: "en",
	};
}
