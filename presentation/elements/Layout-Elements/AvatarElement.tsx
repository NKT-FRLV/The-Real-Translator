import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn/ui/avatar";
import Link from "next/link";
import React from "react";

interface AvatarElementProps {
	avatar_src?: string;
	fallback: string;
	link_href: string;
	className: string;
}

const AvatarElement = ({ avatar_src, fallback = "RT", link_href = "/login", className }: AvatarElementProps) => {
	return (
		<Link href={link_href}>
			<Avatar className={className}>
				<AvatarImage src={avatar_src} />
				<AvatarFallback>{fallback}</AvatarFallback>
			</Avatar>
		</Link>
	);
};

export default AvatarElement;
