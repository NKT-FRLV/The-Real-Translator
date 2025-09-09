import React from "react";
import { StyleCardList } from "@/presentation/elements/App-Description/StyleCardList";
import { Illustration } from "@/presentation/elements/App-Description/Illustration";

export const AppDescription: React.FC = () => {
	return (
		<div className="w-full">
			<div className="py-0 px-2 md:px-3 ">
				<div className="grid grid-cols-1 md:grid-rows-2 lg:grid-cols-2 gap-3 md:gap-2 items-center md:items-start">
					{/* Left Content */}
					<div className="space-y-4 md:space-y-3">
						<div>
							<h2 className="font-rubik-mono text-lg md:text-3xl font-bold text-foreground mb-4 md:mb-3 text-center md:text-left">
								AI-Powered Translator
								<span className="block text-lg md:text-xl font-semibold text-foreground my-4 md:my-2">
									for 100+ Languages
								</span>
							</h2>
							<p className="text-foreground text-sm md:text-lg font-semibold leading-relaxed">
								Experience translation that goes beyond
								word-for-word accuracy. Our AI understands
								context, culture, and nuance to deliver
								translations that sound natural and authentic
								<span className="text-foreground"> — </span>
								
								<span 
									className="font-bold bg-clip-text text-transparent text-nowrap z-0"
									style={{
										background: 'linear-gradient(45deg, #3b82f6, #c084fc, #db2777)',
										WebkitBackgroundClip: 'text',
										WebkitTextFillColor: 'transparent',
										backgroundClip: 'text',
										opacity: 0.85
									}}
								>
									just like a native speaker would say it.
								</span>
							</p>
						</div>

						{/* Translation Styles */}
						<div>
							<h3 className="text-xl md:text-lg font-semibold text-foreground m-0 mb-4 md:mb-3">
								Choose Your Translation Style:
							</h3>
						</div>
					</div>

					{/* Right Content - Illustration */}
					<Illustration priority={true} />
					<StyleCardList />
				</div>
			</div>
		</div>
	);
};
