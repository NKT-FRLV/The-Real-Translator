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
		<div className="h-full p-4 flex flex-col items-center justify-center gap-4">
			<div className="w-24 h-24 rounded-full overflow-hidden">
				<Image
					src={user.image ?? ""}
					alt={user.name ?? ""}
					width={100}
					height={100}
				/>
			</div>
			<h1 className="text-2xl font-bold">{user.name}</h1>
			<p className="text-sm text-gray-500">{user.email}</p>

			<p className="text-sm">
				Status:{" "}
				<span className="font-bold text-background bg-gray-100 px-2 py-1 ml-2 rounded-md">
					{user.role}
				</span>
			</p>
		</div>
	);
};

export default UserInfo;
