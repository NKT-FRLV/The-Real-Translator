'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/shadcn/ui/avatar";
import { signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,

	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/shadcn/ui/dropdown-menu";
import Link from "next/link";

interface AvatarElementProps {
	avatar_src?: string;
	fallback: string;
	link_href: string;
	className: string;
}

const AvatarElement = ({
	avatar_src,
	fallback = "RT",
	link_href = "/login",
	className,
}: AvatarElementProps) => {
	// const [isOpen, setIsOpen] = useState(false);

	return (

		<>
			<DropdownMenu  >
				<DropdownMenuTrigger asChild className="cursor-pointer">
					<Avatar className={className}>
						<AvatarImage src={avatar_src} />
						<AvatarFallback>{fallback}</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent sideOffset={6}>
					{/* <DropdownMenuLabel>Options</DropdownMenuLabel>
					<DropdownMenuSeparator /> */}
					<DropdownMenuItem asChild className="flex justify-center">
						<Link href={"/"}>{"Tranlsate Page"}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild className="flex justify-center">
						<Link href={"/grammar-check"}>{"Grammar Page"}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild className="flex justify-center">
						<Link href={link_href}>{"Profile"}</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						className="flex justify-center"
						onClick={() => signOut()}
					>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
		//  </Link>
	);
};

export default AvatarElement;
