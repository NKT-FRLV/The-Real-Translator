import { cache } from "react";
import { auth } from "@/app/auth";
import { Session } from "next-auth";

export const authCached = cache(async (): Promise<Session | null> => {
	console.log("auth Cached");
	return await auth();
});