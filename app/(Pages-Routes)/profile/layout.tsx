import ProfileButton from "./_components/ProfileButton";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Header with navigation buttons - mobile first */}
			<div className="w-full flex items-center justify-between bg-transparent px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12">
				<ProfileButton action="goBack" />
				<ProfileButton action="sign-out" />
			</div>
			
			{/* Main content area - mobile first layout */}
			<div className="relative w-full h-full mx-auto flex flex-col gap-4 px-4 pb-4 sm:px-6 sm:pb-6 md:flex-row md:px-8 md:pb-8 lg:px-12 lg:pb-12">
				{children}
			</div>
		</>
	);
}
