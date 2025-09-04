import React from "react";

const Loading = () => {
	console.log("Loading main page")
	return (
		<div className="relative row-start-2 row-end-3 col-start-1 col-span-full md:row-start-1 md:col-start-2 flex items-center justify-center">

				<div className="relative">
					<div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary/60 rounded-full animate-spin animate-pulse"></div>
				</div>

		</div>
	);
};

export default Loading;
