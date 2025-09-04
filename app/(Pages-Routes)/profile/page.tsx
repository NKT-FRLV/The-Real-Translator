// import UserInfo from "./_components/UserInfo";
import SettingsWindow from "./_components/boxes/SettingsWindow";
import { auth } from "@/app/auth";
// import { redirect } from "next/navigation";
// import { Separator } from "@/shared/shadcn/ui/separator";

const ProfilePage = async () => {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		return null
	}

	return (
		<>
			{/* <UserInfo user={user} /> */}

			
			{/* Responsive separator - horizontal on mobile, vertical on desktop */}
			{/* <div className="block md:hidden">
				<Separator className="w-full mt-2 md:mt-4" orientation="horizontal" />
			</div>
			<div className="hidden md:block">
				<Separator className="h-full mx-4 md:mx-6" orientation="vertical" />
			</div> */}
			<SettingsWindow user={user} />
		</>
	);
};

export default ProfilePage;
