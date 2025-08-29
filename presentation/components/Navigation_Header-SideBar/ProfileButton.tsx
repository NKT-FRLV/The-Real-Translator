import { Button } from "@/shared/shadcn/ui/button";
import Link from "next/link";
import React from "react";
import AvatarElement from "@/presentation/elements/Layout-Elements/AvatarElement";

interface ProfileButtonProps {
	isAuth?: boolean;
	avatarSrc?: string;
	userName?: string;
	size: "mobile" | "desktop";
}

const ProfileButton = ({
	isAuth,
	avatarSrc,
	userName,
	size,
}: ProfileButtonProps) => {
	return (
		<>
			{isAuth ? (
				<AvatarElement
					link_href={"/profile"}
					avatar_src={avatarSrc}
					fallback={(userName?.slice(0, 2) ?? "RT").toUpperCase()}
					className={size === "mobile" ? "w-8 h-8" : "w-12 h-12 mb-6"}
				/>
			) : (
				<Button
					asChild
					variant="outline"
					size="icon"
					className={size === "mobile" ? "px-6" : "p-6 mb-6"}
				>
					<Link href="/login">Sign in</Link>
				</Button>
			)}
		</>
	);
};

export default ProfileButton;
