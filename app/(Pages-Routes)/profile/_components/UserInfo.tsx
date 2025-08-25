"use client";
import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const UserInfo = () => {
	const { data: session } = useSession();
	const user = session?.user;
	console.log(!user ? "ЮЗЕРА НЕТ" : "ЮЗЕР ЕСТЬ");

	if (!user) return null;

	return (
		<div className="w-full md:w-auto md:max-w-md flex flex-col items-center justify-start gap-3 p-3 sm:gap-4 sm:p-4 md:gap-6 md:p-6">
			{/* Avatar - mobile first responsive sizing */}
			<div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
				<Image
					src={user.image ?? ""}
					alt={user.name ?? ""}
					width={128}
					height={128}
					className="object-cover w-full h-full"
				/>
			</div>
			
			{/* Name - responsive typography */}
			<h1 className="text-lg font-bold text-center sm:text-xl md:text-2xl lg:text-3xl">
				{user.name}
			</h1>
			
			{/* Email - responsive and truncated on small screens */}
			<p className="text-xs text-muted-foreground text-center truncate max-w-full sm:text-sm md:text-base">
				{user.email}
			</p>

			{/* Status badge - mobile first design */}
			<div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
				<span className="text-xs text-muted-foreground sm:text-sm">Status:</span>
				<span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full text-xs sm:text-sm capitalize border border-primary/20">
					{user.role}
				</span>
			</div>
		</div>
	);
};

export default UserInfo;
