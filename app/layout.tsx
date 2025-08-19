import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientWarmer } from "@/presentation/components/ClientWarmer";
import { PerformanceMonitor } from "@/presentation/components/PerformanceMonitor";
import "./globals.css";

import Footer from "@/presentation/components/footer/Footer";
import ThemeProvider from "@/presentation/providers/ThemeProvider";
import { Toaster } from "@/shared/shadcn/ui/sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "The Real Translator",
	description:
		"Fast AI-powered translation with custom styles of translation.",
	metadataBase: new URL("https://translator.nkt-frlv.dev/"),

	openGraph: {
		title: "The Real Translator",
		description:
			"Fast AI-powered translation with custom styles of translation.",
		images: ["/opengraph-image.png"],
	},

	twitter: {
		card: "summary_large_image",
		title: "The Real Translator",
		description:
			"Fast AI-powered translation with custom styles of translation.",
		images: ["/opengraph-image.png"],
	},

	// PWA иконки для iOS и других платформ
	icons: {
		icon: [
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
		],
		apple: [
			{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
			{ url: "/apple-touch-icon-167.png", sizes: "167x167", type: "image/png" },
			{ url: "/apple-touch-icon-152.png", sizes: "152x152", type: "image/png" },
			{ url: "/apple-touch-icon-120.png", sizes: "120x120", type: "image/png" },
		],
		shortcut: "/favicon.ico",
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#0ea5e9",
			},
		],
	},

	// PWA настройки для iOS
	appleWebApp: {
		capable: true,
		title: "The Real Translator",
		statusBarStyle: "default",
	},

	// Цвет темы для адресной строки
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
	],

	// Подключение веб-манифеста
	manifest: "/manifest.json",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{/* Just widgets temporals*/}
					<ClientWarmer />
					<PerformanceMonitor />
					<div className="h-max-content flex flex-col justify-between items-center font-sans py-4 px-0 md:pb-20 md:p-8">
						<main className="flex flex-col items-center justify-center flex-1 sm:items-start w-full">
							{children}
						</main>
						<Footer />
					</div>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
