import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { ClientWarmer } from "@/presentation/components/ClientWarmer";
import { PerformanceMonitor } from "@/presentation/components/PerformanceMonitor";
import "./globals.css";

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
				<ClientWarmer />
				<PerformanceMonitor />
				<div className="h-max-content flex flex-col justify-between items-center font-sans py-4 px-0 md:pb-20 md:p-8">
					<main className="flex flex-col items-center justify-center flex-1 sm:items-start w-full">
						{children}
					</main>
					<footer className="max-w-[300px] md:max-w-full row-start-3 flex gap-12 flex-wrap items-center justify-center pt-20">
						<a
							className="flex items-center gap-2 hover:underline hover:underline-offset-4"
							href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								aria-hidden
								src="/file.svg"
								alt="File icon"
								width={16}
								height={16}
							/>
							Learn
						</a>
						<a
							className="flex items-center gap-2 hover:underline hover:underline-offset-4"
							href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								aria-hidden
								src="/window.svg"
								alt="Window icon"
								width={16}
								height={16}
							/>
							Examples
						</a>
						<a
							className="flex items-center gap-2 hover:underline hover:underline-offset-4 tracking-wide"
							href="https://github.com/NKT-FRLV"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								aria-hidden
								src="/globe.svg"
								alt="Globe icon"
								width={16}
								height={16}
							/>
							Go to NKT.FRLV&apos;s GitHub →
						</a>
					</footer>
				</div>
			</body>
		</html>
	);
}
