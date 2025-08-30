import { LoginForm } from "@/app/(Pages-Routes)/login/_components/login-form";

export default function LoginPage() {
	return (
		<>
			<div className="relative row-start-2 row-end-3 col-start-1 col-span-full md:row-start-1 md:col-start-2 px-6 md:px-0 flex items-center justify-center">
				<LoginForm />
			</div>
		</>
	);
}
