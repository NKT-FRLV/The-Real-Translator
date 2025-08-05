import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientWarmer } from "@/presentation/components/ClientWarmer";
import { PerformanceMonitor } from "@/presentation/components/PerformanceMonitor";
import "./globals.css";
import Footer from "@/presentation/components/footer/Footer";

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
	description: "Fast AI-powered translation with real-time streaming. Translate between multiple languages instantly. As natural as possible.",
	metadataBase: new URL("https://translator.nkt-frlv.dev/"),
	
	openGraph: {
		title: "The Real Translator",
		description: "Fast AI-powered translation with real-time streaming. Translate between multiple languages instantly. As natural as possible.",
		images: ["/opengraph-image.png"],
	},
	
	twitter: {
		card: "summary_large_image",
		title: "The Real Translator",
		description: "Fast AI-powered translation with real-time streaming. Translate between multiple languages instantly.",
		images: ["/opengraph-image.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
			</body>
		</html>
	);
}
