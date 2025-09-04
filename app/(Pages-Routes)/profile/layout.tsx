import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/shared/shadcn/ui/separator";
import UserInfo from "./_components/boxes/UserInfo";
import ProfileButton from "./_components/ProfileButton";

export default async function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		redirect("/login");
	}

	return (
		<main className="row-start-2 md:row-start-1 md:row-end-3 md:col-start-2 md:col-end-3 px-0 flex flex-col items-center sm:items-start">
			{/* Header with navigation buttons - mobile first */}
			<div className="sticky top-0 md:top-0 z-40 w-full flex items-center justify-between bg-background/50 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12 border-b border-border/50">
				<ProfileButton action="goBack" />
				<ProfileButton action="sign-out" />
			</div>
			
			{/* Main content area - mobile first layout */}
			<div className="relative w-full h-full mx-auto flex flex-col px-4 pb-4 sm:px-6 sm:pb-6 md:flex-row">
				<UserInfo user={user} />
				<div className="block md:hidden">
				<Separator className="w-full mt-2 md:mt-4" orientation="horizontal" />
			</div>
			<div className="hidden md:block">
				<Separator className="h-full mx-4 md:mx-6" orientation="vertical" />
			</div>
				{children}
			</div>
		</main>
	);
}
