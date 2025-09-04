import { Avatar, AvatarImage, AvatarFallback } from "@/shared/shadcn/ui/avatar";
import type { User } from "next-auth";

interface UserInfoProps {
	user: User
}

const UserInfo = ({user}: UserInfoProps) => {

	if (!user) return null;

	return (
		<div className="relative mt-2 md:m-0">
			<div className="static md:sticky md:top-18 md:w-auto md:max-w-md grid grid-cols-2 md:flex md:flex-col md:items-center md:justify-start md:mt-12 gap-3 p-1 sm:gap-4 md:gap-3 md:p-6">
				{/* Avatar - first column on mobile, full width on desktop */}
				<div className="flex justify-center items-start md:justify-center">
					<Avatar className="w-26 h-26 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
						<AvatarImage
							src={user.image ?? ""}
							alt={user.name ?? ""}
							width={128}
							height={128}
							className="object-cover w-full h-full"
						/>
						<AvatarFallback className="text-foreground bg-background">{user.name?.slice(0,2).toUpperCase() || 'YOU'}</AvatarFallback>
					</Avatar>
				</div>

				{/* Content - second column on mobile, full width on desktop */}
				<div className="flex flex-col gap-2 justify-center md:items-center md:text-center">
					{/* Name - responsive typography */}
					<h1 className="text-lg font-bold sm:text-xl md:text-2xl lg:text-3xl">
						{user.name || 'empty'}
					</h1>

					{/* Email - responsive and truncated on small screens */}
					<p className="text-xs text-muted-foreground truncate max-w-full sm:text-sm md:text-base">
						{user.email || 'empty'}
					</p>

					{/* Status badge */}
					<div className="flex gap-2 items-center">
						<span className="text-xs text-muted-foreground sm:text-sm">
							Status:
						</span>
						<span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full text-xs sm:text-sm capitalize border border-primary/20 w-fit">
							{user.role || 'empty'}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserInfo;
