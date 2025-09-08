// presentation/components/Layout/DesktopSidebarClient.tsx

import ThemeSwitcher from "../ThemeSwitcher";
import Logo from "../Logo";
import ProfileButton from "../ProfileButton";
import NavIcon from "../NavIcon";

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

			<div className="flex-1 flex flex-col gap-12 items-center justify-start">
				<ThemeSwitcher className="mt-10" />
				<nav className="flex flex-col gap-6 mt-6">
					{/* Иконка перевода */}
					<NavIcon
						iconType={'languages'}
						href="/profile?tab=translations"
					/>

					{/* Иконка истории */}
					<NavIcon
						iconType={'clock'}
						href="/profile?tab=history"
					/>

					{/* Иконка избранного */}
					<NavIcon
						iconType={'heart'}
						href="/profile?tab=favorites"
					/>

					{/* Демо темы */}
					<NavIcon
						iconType={'theme-demo'}
						href="/theme-demo"
					/>

					{/* Иконка настроек */}
					<NavIcon
						iconType={'settings'}
						href="/profile?tab=settings"
					/>

					{/* Иконка помощи */}
					<NavIcon
						iconType={'help'}
						href="/profile?tab=help"
					/>
				</nav>
			</div>

			<div className="flex items-center">
			<ProfileButton isAuth={isAuth} avatarSrc={avatarSrc} userName={userName} size="desktop" />
			</div>
		</header>
	);
}
