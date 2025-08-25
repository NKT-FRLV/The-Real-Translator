"use client";
import React, { useState } from "react";
import {
	X,
	Volume2,
	Mic,
	Copy,
	Bookmark,
	Share,
	ThumbsUp,
	ThumbsDown,
} from "lucide-react";
import { Textarea } from "@/shared/shadcn/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface TextAreaProps {
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onClear?: () => void;
	placeholder?: string;
	renderCustomPlaceholder?: () => React.ReactNode;
	isInput?: boolean;
	readOnly?: boolean;
	maxLength?: number;
	className?: string;
	translationId?: string | null;
	isTranslationComplete?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({
	value = "",
	onChange,
	onClear,
	placeholder,
	renderCustomPlaceholder,
	isInput = false,
	readOnly = false,
	maxLength = 10000,
	className,
	translationId,
	isTranslationComplete = false,
}) => {
	const { data: session } = useSession();
	const [isLiked, setIsLiked] = useState(false);
	const [isLiking, setIsLiking] = useState(false);


	const onCopy = async () => {
		if (value.length === 0) {
			return;
		}
		try {
			await navigator.clipboard.writeText(value);
			toast.success("Copied", {
				action: {
					label: "Undo",
					onClick: () => toast.dismiss(),
				},
			});
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message, {
					description: "Enter some text before.",
					action: {
						label: "Undo",
						onClick: () => toast.dismiss(),
					},
				});
			}
		}
	};

	const onLike = async () => {
		if (!session?.user?.id) {
			toast.error("Please sign in to like translations");
			return;
		}

		if (!translationId || !isTranslationComplete) {
			toast.error("Translation is not ready yet");
			return;
		}

		if (isLiking) return;

		setIsLiking(true);
		try {
			const response = await fetch(`/api/translations/${translationId}/like`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					liked: !isLiked,
				}),
			});

			if (response.ok) {
				setIsLiked(!isLiked);
				toast.success(
					isLiked ? "Translation unliked" : "Translation liked",
					{
						action: {
							label: "Undo",
							onClick: () => toast.dismiss(),
						},
					}
				);
			} else {
				toast.error("Failed to update like status");
			}
		} catch (error) {
			console.error("Error liking translation:", error);
			toast.error("Failed to like translation");
		} finally {
			setIsLiking(false);
		}
	};
	

	return (
		<div className="flex flex-col w-full h-full rounded-lg border border-gray-700 bg-accent/30">
			<label
				className="p-3 md:p-3 min-h-[120px] md:min-h-[180px] flex-1 relative"
				style={{ height: "fit-content" }}
			>
				<Textarea
					value={value}
					onChange={onChange}
					onClick={() => {
						if (readOnly) {
							onCopy();
						}
					}}
					placeholder={readOnly ? undefined : placeholder}
					readOnly={readOnly}
					className={`w-full bg-transparent text-foreground placeholder-gray-500 border-none outline-none resize-none ${
						value.length < 30
							? "text-lg md:text-2xl lg:text-3xl"
							: "text-sm md:text-base lg:text-lg"
					} font-medium placeholder:text-sm md:placeholder:text-base lg:placeholder:text-lg ${className}`}
					maxLength={maxLength}
					style={{
						height: "100%",
						minHeight: "100%",
						maxHeight: "100%",
						overflow: "auto",
					}}
				/>

				{renderCustomPlaceholder && renderCustomPlaceholder()}
			</label>

			<div className="border-t border-gray-700 p-2 md:p-2 flex justify-between items-center">
				<div className="flex items-center space-x-1 md:space-x-2">
					<button className="p-1.5 md:p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
						<Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
					</button>

					{isInput && (
						<button className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
							<Mic className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
						</button>
					)}

					<button
						onClick={onCopy}
						className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
					>
						<Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
					</button>
				</div>

				<div className="flex items-center space-x-1 md:space-x-2">
					{isInput ? (
						<>
							<span className="text-xs md:text-sm text-gray-500">
								{value.length}/{maxLength}
							</span>
							{value.length > 0 && (
								<button
									onClick={onClear}
									className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
								>
									<X className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
								</button>
							)}
						</>
					) : (
						<>
							<button className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
								<Bookmark className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
							</button>
							<button className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
								<Share className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
							</button>
							<button 
								onClick={onLike}
								disabled={isLiking || !translationId || !isTranslationComplete}
								className={`p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors ${
									isLiked ? "bg-blue-600 hover:bg-blue-700" : ""
								} ${
									isLiking || !translationId || !isTranslationComplete ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								<ThumbsUp className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
									isLiked ? "text-red-500" : "text-gray-400"
								}`} />
							</button>
							<button className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
								<ThumbsDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
							</button>
							<button
								onClick={onCopy}
								className="p-1.5 md:p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
							>
								<Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
