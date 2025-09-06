"use client";
import React, { useState, useEffect } from "react";
import { X, Volume2, Mic, Copy, Bookmark, Share, Heart, Zap } from "lucide-react";
import { Textarea } from "@/shared/shadcn/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { IconButton } from "@/presentation/components/textArea/IconButton";
import { useRouter } from "next/navigation";
import { likeTranslation } from "@/presentation/API/like/likeApi";
import { cn } from '@/shared/shadcn/utils'
import { SpeechMode } from '@/shared/types/settings'

interface TextWindowProps {
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
	// speech to text
	isSpeechSupported?: boolean;
	isBrowserSupportSpeech?: boolean;
	listening?: boolean;
	onVoiceInput?: () => void;
	// speech mode toggle
	speechMode?: SpeechMode;
	onSpeechModeToggle?: () => void;
	// admin features
	isAdmin?: boolean;
	// whisper loading state
	isTranscribing?: boolean;
}

export const TextWindow: React.FC<TextWindowProps> = ({
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
	isSpeechSupported,
	isBrowserSupportSpeech,
	listening,
	onVoiceInput,
	speechMode = "browser",
	onSpeechModeToggle,
	isAdmin = false,
	isTranscribing = false,
}) => {
	const { data: session } = useSession();
	const [isLiked, setIsLiked] = useState(false);
	const [isLiking, setIsLiking] = useState(false);
	const router = useRouter();

	const [hydrated, setHydrated] = useState(false);
	useEffect(() => setHydrated(true), []);

	const disabledMic = !hydrated || !isSpeechSupported || !isBrowserSupportSpeech;

	useEffect(() => {
		setIsLiked(false);
	}, [translationId]);

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
			toast.error("Please sign in to like translations", {
				action: {
					label: "Sign in",
					onClick: () => router.push("/login"),
				},
			});
			return;
		}

		if (!translationId || !isTranslationComplete) {
			toast.error("Translation is not ready yet");
			return;
		}

		if (isLiking) return;

		setIsLiking(true);
		try {
			const result = await likeTranslation(translationId, !isLiked);

			if (result.success) {
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
				// Обрабатываем специфические ошибки
				if (result.error?.includes("Authentication required")) {
					toast.error("Please sign in to like translations", {
						action: {
							label: "Sign in",
							onClick: () => router.push("/login"),
						},
					});
				} else {
					toast.error(result.error || "Failed to update like status");
				}
			}
		} finally {
			setIsLiking(false);
		}
	};

	const getVoiceInputTip = () => {
		if (!isBrowserSupportSpeech) {
			return "Your Browser doesn't support speech input";
		}
		if (!isSpeechSupported) {
			return "Not Supported for this language";
		}
		return "Voice input";
	};

	const voiceInputTip = getVoiceInputTip();

	return (
		<div className="flex flex-col w-full rounded-lg border border-gray-700 bg-accent/30">
			<label className="p-3 md:p-3 min-h-[120px] md:min-h-[180px] relative block flex-1">
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
					className={`w-full min-h-full field-sizing-content pr-6 md:pr-10 bg-transparent text-foreground placeholder-gray-500 border-none outline-none resize-none ${
						value.length < 30
							? "text-lg md:text-2xl lg:text-3xl"
							: "text-sm md:text-base lg:text-lg"
					} font-medium placeholder:text-sm md:placeholder:text-base lg:placeholder:text-lg ${className}`}
					maxLength={maxLength}
				/>

				{renderCustomPlaceholder && renderCustomPlaceholder()}
				{isInput && value.length > 0 && (
					<IconButton
						icon={X}
						className="absolute top-2 right-2"
						onClick={onClear}
						size="big"
					/>
				)}
			</label>

			<div className="border-t border-gray-700 p-2 md:p-2 flex justify-between items-center">
				<div className="flex items-center space-x-1 md:space-x-2">
					<IconButton
						icon={Volume2}
						tip="Text to speech - Coming soon"
						disabled={true}
					/>

					{isInput && (
						<>
							<IconButton
								icon={Mic}
								tip={voiceInputTip}
								disabled={disabledMic}
								onClick={onVoiceInput}
								className={cn(
									listening && 'relative hover:bg-transparent before:absolute before:inset-0 before:bg-red-500/30 before:rounded-full before:animate-ping after:absolute after:inset-0 after:bg-red-500/30 after:rounded-full'
								)}
							/>
							
							{onSpeechModeToggle && isAdmin && (
								<IconButton
									icon={Zap}
									tip={speechMode === "whisper" 
										? "Using Whisper AI -(Admin Only)" 
										: "Basic speech recognition"
									}
									onClick={onSpeechModeToggle}
									isActive={speechMode === "whisper"}
									className={cn(
										speechMode === "whisper" && 'text-yellow-500 bg-yellow-500/20 border-yellow-500/30 shadow-lg',
										speechMode === "whisper" && listening && 'animate-pulse'
									)}
								/>
							)}
							
							{/* Whisper Transcription Loader */}
							{isTranscribing && speechMode === "whisper" && (
								<div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 rounded-md border border-blue-500/20">
									<div className="flex space-x-1">
										<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
										<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
										<div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
									</div>
									<span className="text-xs text-blue-400 font-medium">AI Processing...</span>
								</div>
							)}
						</>
					)}

					<IconButton icon={Copy} onClick={onCopy} tip="Copy text" />
				</div>

				<div className="flex items-center space-x-1 md:space-x-2">
					{isInput ? (
						<>
							<span className="text-xs md:text-sm text-gray-500">
								{value.length}/{maxLength}
							</span>
							{value.length > 0 && (
								<IconButton
									icon={X}
									onClick={onClear}
									tip="Clear text"
								/>
							)}
						</>
					) : (
						<>
							<IconButton
								icon={Bookmark}
								tip="Save translation - Coming soon"
								disabled={true}
							/>
							<IconButton
								icon={Share}
								tip="Share translation - Coming soon"
								disabled={true}
							/>
							<IconButton
								icon={Heart}
								onClick={onLike}
								disabled={
									isLiking ||
									!translationId ||
									!isTranslationComplete
								}
								isActive={isLiked}
								tip={
									isLiked
										? "Unlike translation"
										: "Like translation"
								}
								isLoading={isLiking}
							/>
							<IconButton
								icon={Copy}
								onClick={onCopy}
								tip="Copy text"
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
