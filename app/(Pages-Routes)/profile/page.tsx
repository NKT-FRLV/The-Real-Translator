// import UserInfo from "./_components/UserInfo";
import SettingsWindow from "./_components/boxes/SettingsWindow";
// import { auth } from "@/app/auth";
import { authCached } from "@/app/lib/authCached";
// import { redirect } from "next/navigation";
// import { Separator } from "@/shared/shadcn/ui/separator";

const ProfilePage = async () => {
	const session = await authCached();
	const user = session?.user;

	if (!user) {
		return null
	}

	return (
		<>
			<SettingsWindow user={user} />
		</>
	);
};

export default ProfilePage;
