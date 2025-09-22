import { toast } from "sonner";
import { Session } from "next-auth";

// НАДОЕДЛИВАЯ ФУНКЦИЯ ДЛЯ КИКА У НЕЗАРЕГИСТРИРОВАННЫХ ЮЗЕРОВ

export const mayBeKickOutToLogin= (session: Session | null, action: () => void) => {
	// Mock error
	const chanceToShowError = Math.random() > 0.4;

	console.log("--------------------------------");
	console.log("session is", !!session?.user);
	console.log("chanceToShowError is", chanceToShowError);
	console.log("user", session?.user || "no user");
	console.log("--------------------------------");

	if (!session?.user && chanceToShowError) {
		toast.error("Authentication required", {
			description: "Please log in to use this feature",
			action: {
				label: "Go to Login",
				onClick: action,
			},
		});
		return false;
	}
	return true;
	
}