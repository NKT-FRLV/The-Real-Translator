"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/shadcn/ui/button";
import { signOut } from "next-auth/react";
import { ArrowLeft, LogOut } from "lucide-react";

interface ProfileButtonProps {
	action: "logout" | "goBack";
}

const ProfileButton = ({ action }: ProfileButtonProps) => {
	const router = useRouter();

	const handleAction = async () => {
		if (action === "goBack") {
			router.back();
		} else if (action === "logout") {
			await signOut({ redirect: false }); // Отключаем автоматический редирект
			router.push("/"); // Делаем редирект сами
			router.refresh(); // Обновляем страницу
		}
	};
	return (
		<Button variant="outline" size="sm" onClick={handleAction}>
			{action === "goBack" ? (
				<span className="flex items-center gap-2">
					<ArrowLeft className="w-4 h-4" /> Go back
				</span>
			) : (
				<span className="flex items-center gap-2">
					<LogOut className="w-4 h-4" /> Logout
				</span>
			)}
		</Button>
	);
};

export default ProfileButton;
