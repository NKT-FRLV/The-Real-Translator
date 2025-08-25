import React from "react";

const loading = () => {
	return (
		<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
			<div className="flex flex-col items-center space-y-6">
				{/* Main spinner with glow effect */}
				<div className="relative">
					<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
					<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/60 rounded-full animate-spin animate-pulse"></div>
				</div>
			</div>
		</div>
	);
};

export default loading;
