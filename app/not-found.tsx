import Link from "next/link";
import { cn } from "@/shared/shadcn";

export default async function NotFound() {
	return (
		<div className="relative row-start-2 md:row-start-1 md:row-end-3 md:col-start-2 md:col-end-3 flex flex-col items-center justify-center gap-4 bg-white dark:bg-black">
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
			<p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl md:text-7xl font-bold text-transparent ">
				404 — Not Found
			</p>
			<p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-xl sm:text-2xl md:text-4xl font-bold text-transparent">
				How did you get here?
			</p>
			<Link
				href="/"
				className="relative z-20 text-blue-500 hover:text-blue-700 border-2 border-blue-500 bg-foreground rounded-md p-2"
			>
				<span className="text-background py-8 text-xl sm:text-2xl md:text-4xl font-bold">
					Return Home
				</span>
			</Link>
		</div>
	);
}
