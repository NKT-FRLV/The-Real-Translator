// presentation/components/Layout/DesktopSidebarClient.tsx

import ThemeSwitcher from "../ThemeSwitcher";
import Logo from "../Logo";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/shared/shadcn/ui/navigation-menu";
import ProfileButton from "../ProfileButton";
import NavIcon from "../NavIcon";
import { HelpCircle } from "lucide-react";

export default function DesktopSideNavClient({
	isAuth,
	userName,
	avatarSrc,
}: {
	isAuth: boolean;
	userName?: string;
	avatarSrc: string;
}) {

	return (
		<header className="hidden md:flex fixed top-0 bottom-0 flex-col items-center justify-between p-3 w-[72px]">
			<div className="flex items-center">
				<Logo responsive />
			</div>

			<div className="flex-1 flex flex-col items-center justify-center">
				<ThemeSwitcher className="mt-10" />
				<NavigationMenu viewport={false} className="flex-col mt-0">
					<NavigationMenuList className="flex-col gap-6">
						{/* Иконка перевода */}
						<NavIcon
							iconType={'languages'}
							menuItems={[
								{ label: "Documents" },
								{ label: "Web Pages" },
								{ label: "Text" },
							]}
						/>

						{/* Иконка истории */}
						<NavIcon
							iconType={'clock'}
							menuItems={[
								{ label: "Recent Translations" },
								{ label: "Today" },
								{ label: "This Week" },
							]}
						/>

						{/* Иконка избранного */}
						<NavIcon
							iconType={'heart'}
							menuItems={[
								{ label: "Saved Translations" },
								{ label: "Collections" },
								{ label: "Export" },
							]}
						/>

						{/* Иконка настроек */}
						<NavIcon
							iconType={'settings'}
							menuItems={[
								{ label: "Languages" },
								{ label: "Themes" },
								{ label: "Notifications" },
							]}
						/>

						{/* Иконка помощи */}
						<NavIcon
							iconType={'help'}
							menuItems={[
								{ label: "FAQ" },
								{ label: "Shortcuts" },
								{ label: "Feedback" },
							]}
						/>
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<div className="flex items-center">
			<ProfileButton isAuth={isAuth} avatarSrc={avatarSrc} userName={userName} size="desktop" />
			</div>
		</header>
	);
}
