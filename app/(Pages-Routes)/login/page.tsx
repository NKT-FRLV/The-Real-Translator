import { LoginForm } from "@/app/(Pages-Routes)/login/_components/login-form";
import { cn } from "@/shared/shadcn";

export default function LoginPage() {
	return (
		<>

			<div className="relative row-start-2 row-end-3 col-start-1 col-span-full md:row-start-1 md:col-start-2 px-6 md:px-0 flex items-center justify-center">
			<div className="relative flex flex-col h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
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

				<LoginForm />

			</div>
				
			</div>
		</>
	);
}
