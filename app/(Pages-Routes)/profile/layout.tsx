import ProfileButton from "./_components/ProfileButton";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Header with navigation buttons - mobile first */}
			<div className="sticky top-[55px] md:top-0 z-40 w-full flex items-center justify-between bg-background/50 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-12 border-b border-border/50">
				<ProfileButton action="goBack" />
				<ProfileButton action="sign-out" />
			</div>
			
			{/* Main content area - mobile first layout */}
			<div className="relative w-full h-full mx-auto flex flex-col gap-4 px-4 pb-4 sm:px-6 sm:pb-6 md:flex-row">
				{children}
			</div>
		</>
	);
}
