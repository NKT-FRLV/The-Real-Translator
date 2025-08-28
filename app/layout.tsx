import type { Metadata } from "next";
export { viewport } from "./viewport";
import { Geist, Geist_Mono } from "next/font/google";
import { PWAThemeManager } from "@/presentation/components/PWAThemeManager";
import { PerformanceMonitor } from "@/presentation/components/PerformanceMonitor";
import { SplashScreenManager } from "@/presentation/components/SplashScreenManager";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/app/auth";
import "./globals.css";

// import Footer from "@/presentation/components/footer/Footer";
import ThemeProvider from "@/presentation/providers/ThemeProvider";
import HeaderShell from "@/presentation/components/Navigation_Header-SideBar/mobile-header/HeaderShell";
import SideNavShell from "@/presentation/components/Navigation_Header-SideBar/desctop-sidebar/SideNavShell";

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
			{
				url: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
			{
				url: "/apple-touch-icon-167.png",
				sizes: "167x167",
				type: "image/png",
			},
			{
				url: "/apple-touch-icon-152.png",
				sizes: "152x152",
				type: "image/png",
			},
			{
				url: "/apple-touch-icon-120.png",
				sizes: "120x120",
				type: "image/png",
			},
		],
		shortcut: "/favicon.ico",
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#0b0b0b",
			},
		],
	},

	// PWA настройки для iOS
	appleWebApp: {
		capable: true,
		title: "The Real Translator",
		statusBarStyle: "default",
		startupImage: [
			{
				url: "/splash-640x1136.png",
				media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash-750x1334.png",
				media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash-1242x2688.png",
				media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
			},
			{
				url: "/splash-1536x2048.png",
				media: "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
			},
		],
	},



	// Подключение веб-манифеста
	manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SessionProvider session={session}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{/* Just widgets temporals*/}
					<PWAThemeManager />
					<PerformanceMonitor />
					<SplashScreenManager />
					<div className="min-h-dvh grid grid-rows-[auto_1fr] md:md:grid-cols-[72px_1fr]">
						<HeaderShell />

						{/* Десктопный сайдбар */}
						<SideNavShell />

						{/* НАДО НАСТРАИВАТЬ GRID ДЛЯ КАЖДОЙ СТРАНИЦЫ */}
							{children}
						
					</div>

					{/* </div> */}
				</ThemeProvider>
				<Toaster />
				</SessionProvider>
			</body>
		</html>
	);
}
