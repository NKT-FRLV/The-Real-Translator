
import ProfileButton from "./_components/ProfileButton";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<div className="w-full flex items-center justify-between bg-transparent px-12 py-4">
				<ProfileButton action="goBack" />
				<ProfileButton action="logout" />
			</div>
			<div className="min-w-[600px] h-full m-auto flex items-center justify-between gap-4">
				{children}
			</div>
		</>
	);
}
