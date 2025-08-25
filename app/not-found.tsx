import Link from "next/link";

export default async function NotFound() {
	return (
		<div className="w-full h-full m-auto flex flex-col items-center justify-center gap-4">
			<h2 className="text-3xl font-bold">404 — Not Found</h2>

			<p className="text-muted-foreground">How did you get here?</p>
			<Link href="/" className="text-blue-500 hover:text-blue-700 border-2 border-blue-500 rounded-md p-2">
				Return Home
			</Link>
		</div>
	);
}
