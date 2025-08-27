import React from "react";

const loading = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="flex flex-col items-center space-y-6">
				{/* Main spinner with glow effect */}
				<div className="relative flex items-center justify-center">
					<div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
					<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/60 rounded-full animate-spin animate-pulse"></div>
				</div>
			</div>
		</div>
	);
};

export default loading;
