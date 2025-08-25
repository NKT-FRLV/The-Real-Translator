"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/shadcn/ui/button";
import { signOut } from "next-auth/react";
import { ArrowLeft, LogOut } from "lucide-react";

interface ProfileButtonProps {
	action: "sign-out" | "goBack";
}

const ProfileButton = ({ action }: ProfileButtonProps) => {
	const router = useRouter();

	const handleAction = async () => {
		if (action === "goBack") {
			router.back();
		} else if (action === "sign-out") {
			await signOut({ redirect: false }); // Отключаем автоматический редирект
			router.push("/"); // Делаем редирект сами
			router.refresh(); // Обновляем страницу
		}
	};
	
	return (
		<Button variant="outline" size="sm" onClick={handleAction} className="flex items-center gap-1 sm:gap-2">
			{action === "goBack" ? (
				<>
					<ArrowLeft className="w-4 h-4" />
					<span className="hidden xs:inline">Go back</span>
					<span className="xs:hidden">Back</span>
				</>
			) : (
				<>
					<LogOut className="w-4 h-4" />
					<span className="hidden xs:inline">Sign out</span>
					<span className="xs:hidden">Exit</span>
				</>
			)}
		</Button>
	);
};

export default ProfileButton;
