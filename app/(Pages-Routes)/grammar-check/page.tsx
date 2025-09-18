import React from "react";
import GrammarCheckPage from "./_components/GrammarCheckPage";
import { cn } from "@/shared/shadcn";

export default async function GrammarCheck() {
	return (
		<main className="relative row-start-2 md:row-full md:col-start-2 px-0 md:px-2 md:py-2 flex flex-col items-center justify-start md:justify-center sm:items-start">
			<div
				className={cn(
					"absolute inset-0",
					"[background-size:40px_40px]",
					"[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
					"dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
				)}
			/>
			{/* Radial gradient for the container to give a faded look */}
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
			<GrammarCheckPage />
		</main>
	);
}