import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "The Real Translator",
		short_name: "Translator",
		description:
			"Fast AI-powered translation with custom styles of translation.",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
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
		screenshots: [
			{
				src: "/splash-640x1136.png",
				sizes: "640x1136",
				type: "image/png",
				form_factor: "narrow",
			},
			{
				src: "/splash-750x1334.png",
				sizes: "750x1334",
				type: "image/png",
				form_factor: "narrow",
			},
			{
				src: "/splash-1242x2688.png",
				sizes: "1242x2688",
				type: "image/png",
				form_factor: "narrow",
			},
			{
				src: "/splash-1536x2048.png",
				sizes: "1536x2048",
				type: "image/png",
				form_factor: "wide",
			},
		],
		categories: ["productivity", "utilities"],
		orientation: "portrait-primary",
		scope: "/",
		lang: "en",
	};
}
