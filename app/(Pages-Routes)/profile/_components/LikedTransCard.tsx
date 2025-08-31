import React from "react";
import { languages } from "@/shared/config/translation";
import { Calendar, Languages, Copy, Trash, Loader2 } from "lucide-react";
import { Translation } from "@prisma/client";
import { Button } from "@/shared/shadcn/ui/button";

interface LikedTransCard {
	translation: Translation;
	isDeliting: boolean;
	onCopy: (text: string) => void;
	onDelete: (translationId: string) => void;
}

const LikedTransCard = ({
	translation,
	isDeliting,
	onCopy,
	onDelete,
}: LikedTransCard) => {


	const formatDate = (dateString: Date) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	return (
		<div className="w-full bg-card rounded-lg p-3 border border-border shadow-md sm:p-4">
			{/* Header with language info and date - mobile first */}
			<div className="flex space-y-2 mb-3 items-start justify-between space-y-0 md:mb-4">
				<div className="flex items-center space-x-1 text-xs text-muted-foreground sm:space-x-2 sm:text-sm">
					<Languages className="w-3 h-3 flex-shrink-0 sm:w-4 sm:h-4" />
					<span className="uppercase truncate">
						{
							languages[
								translation.sourceLang as keyof typeof languages
							].label
						}
					</span>
					<span>→</span>
					<span className="uppercase truncate">
						{
							languages[
								translation.targetLang as keyof typeof languages
							].label
						}
					</span>
				</div>
				<div className="flex items-center space-x-1 text-xs text-muted-foreground self-start sm:space-x-2 sm:text-sm">
					<Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
					<span className="whitespace-nowrap">
						{formatDate(translation.createdAt)}
					</span>
				</div>
			</div>

			{/* Translation content - stacked on mobile, side by side on desktop */}
			<div className="space-y-3 sm:space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
				{/* Source text */}
				<div>
					<p className="text-xs text-muted-foreground mb-1 font-medium sm:text-sm">
						Source
					</p>
					<div className="relative bg-muted/50 rounded-md p-2 border border-border sm:p-3 sm:pr-8">
						<p className="text-xs leading-relaxed sm:text-sm">
							{translation.sourceText}
						</p>
						<div className="absolute top-2 right-2">
							<button
								onClick={() => onCopy(translation.sourceText)}
								className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
							>
								<Copy className="w-3 h-3 text-muted-foreground hover:text-foreground sm:w-3.5 sm:h-3.5" />
							</button>
						</div>
					</div>
				</div>

				{/* Translation text */}
				<div>
					<p className="text-xs text-muted-foreground mb-1 font-medium sm:text-sm">
						Translation
					</p>
					<div className="relative bg-muted/50 rounded-md p-2 border border-border sm:p-3 sm:pr-8">
						<p className="text-xs leading-relaxed sm:text-sm">
							{translation.resultText}
						</p>
						<div className="absolute top-2 right-2">
							<button
								onClick={() => onCopy(translation.resultText)}
								className="p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
							>
								<Copy className="w-3 h-3 text-muted-foreground hover:text-foreground sm:w-3.5 sm:h-3.5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="flex mt-4 justify-between items-center">
				{/* Translation info */}
				<div className="flex gap-4">
					<span>
						<span className="text-xs text-muted-foreground">
							Style:{" "}
						</span>
						<span className="text-xs font-medium capitalize">
							{translation.tone}
						</span>
					</span>
					<span>
						<span className="text-xs text-muted-foreground">
							Model:{" "}
						</span>
						<span className="text-xs font-medium capitalize">
							{translation.model}
						</span>
					</span>
				</div>
				<Button
					variant="outline"
					className="bg-primary/20! hover:bg-primary/50! text-primary/80"
					aria-label="Delete translation"
					onClick={() => onDelete(translation.id)}
				>
					{!isDeliting ? (
						<Trash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
					) : (
						<Loader2
							className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin"
							size={undefined}
						/>
					)}
					<span className="text-xs">Delete</span>
				</Button>
			</div>
		</div>
	);
};

export default LikedTransCard;
