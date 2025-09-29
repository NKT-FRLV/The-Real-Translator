import type { Metadata } from "next";
export { viewport } from "./viewport";
import { Geist_Mono, Rubik_Mono_One, Orbitron, Inter } from "next/font/google";
import { PWAThemeManager } from "@/presentation/components/PWAThemeManager";
// import { PerformanceMonitor } from "@/presentation/components/PerformanceMonitor";
import { SplashScreenManager } from "@/presentation/components/SplashScreenManager";
import { ServiceWorkerManager } from "@/presentation/components/ServiceWorkerManager";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/presentation/providers/QueryProvider";
import SessionHeartbeat from "@/presentation/SessionHeartBeat";
// import { auth } from "@/app/auth";
import { authCached } from "./lib/authCached";
import "./globals.css";

// import Footer from "@/presentation/components/footer/Footer";
import ThemeProvider from "@/presentation/providers/ThemeProvider";
import HeaderShell from "@/presentation/components/Navigation_Header-SideBar/mobile-header/HeaderShell";
import SideNavShell from "@/presentation/components/Navigation_Header-SideBar/desctop-sidebar/SideNavShell";

import { Toaster } from "@/shared/shadcn/ui/sonner";

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const rubikMonoOne = Rubik_Mono_One({
	weight: "400", // у него только один вес
	subsets: ["latin", "cyrillic"],
	variable: "--font-rubik-mono",
	display: "swap",
});

const orbitron = Orbitron({
	weight: ["400", "500", "600"],
	subsets: ["latin"],
	variable: "--font-orbitron",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin", "cyrillic"],
	variable: "--font-inter",
	display: "swap",
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
				color: "#ffffff",
			},
		],
	},

	// PWA настройки для iOS
	appleWebApp: {
		capable: true,
		title: "The Real Translator",
		statusBarStyle: "black-translucent",
		startupImage: [
			// iPhone 16 Pro Max (6.9") – 2868×1320
			{
				url: "/splash-1320x2868.png",
				media: "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			// iPhone 16 Pro (6.3") – 2622×1206
			{
				url: "/splash-1206x2622.png",
				media: "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			// iPhone 16 / 15 / 14 Pro (6.1") – 2556×1179
			{
				url: "/splash-1179x2556.png",
				media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
			// iPhone 16 Plus / 15 Pro Max / 15 Plus (6.7") – 2796×1290
			{
				url: "/splash-1290x2796.png",
				media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
			},
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

	// Манифест автоматически генерируется из app/manifest.ts
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await authCached();

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistMono.variable} ${rubikMonoOne.variable} ${orbitron.variable} ${inter.variable} antialiased`}
			>
				<SessionHeartbeat />
				<QueryProvider>
					<SessionProvider session={session}>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							{/* PWA Components */}
							<PWAThemeManager />
							<SplashScreenManager />
							<ServiceWorkerManager />

							{/* <PerformanceMonitor /> */}

							<div className="min-h-dvh grid grid-cols-1 grid-rows-[auto_1fr] md:md:grid-cols-[72px_1fr]">
								<HeaderShell user={session?.user} />

								{/* Десктопный сайдбар */}
								<SideNavShell user={session?.user} />

								{/* НАДО НАСТРАИВАТЬ GRID ДЛЯ КАЖДОЙ СТРАНИЦЫ */}
								{children}
							</div>
						</ThemeProvider>
						<Toaster />
					</SessionProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
