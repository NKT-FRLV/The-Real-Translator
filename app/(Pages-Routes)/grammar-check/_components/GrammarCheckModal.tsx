"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/shadcn/ui/dialog";
import { Button } from "@/shared/shadcn/ui/button";
import { TextDiff } from "./TextDiff";
import { ErrorExplanations } from "./Explain-Errors/ErrorExplanations";
import StyleSelector, { EditingStyle } from "./StyleSelector";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import {  GrammarError } from "./grammar-schema";
import {
	RotateCcw,
	Copy,
	Check,
	Info,
	Languages,
	MousePointerClick,
} from "lucide-react";
import { ErrorsExplanationsResponse, GrammarError } from "./grammar-schema";
import { useTranslatorStore } from "@/presentation/stores/translatorStore";
import { Skeleton } from "@/shared/shadcn/ui/skeleton";
// import ChangesSummary from "./Explain-Errors/changes-summary";

interface GrammarCheckModalProps {
	isOpen: boolean;
	onClose: () => void;
	originalText?: string;
	correctedText: string;
	// errors: GrammarError[];
	editingStyle: EditingStyle;
	onStyleChange: (style: EditingStyle) => void;
	onRegenerate: () => void;
	onApplyChanges: () => void;
	isLoading?: boolean;
	// Новые поля для diff формата
	correctedWithDiffText?: string;
}

export default function GrammarCheckModal({
	isOpen,
	onClose,
	originalText,
	correctedText,
	editingStyle,
	onStyleChange,
	onRegenerate,
	onApplyChanges,
	isLoading = false,
	correctedWithDiffText,
}: GrammarCheckModalProps) {
	const router = useRouter();
	const { setInputText } = useTranslatorStore();
	const [copied, setCopied] = useState(false);
	const [errors, setErrors] = useState<GrammarError[]>([]);
	const [isErrorsLoading, setIsErrorsLoading] = useState(false);

	useEffect(() => {
		setErrors([]);
		setIsErrorsLoading(false);
		setCopied(false);
	}, [originalText]);

	const handleExplainErrors = async () => {
		if (!originalText || !correctedText) return;

		setIsErrorsLoading(true);
		try {
			const result = await fetch("/api/grammar/explain", {
				method: "POST",
				body: JSON.stringify({
					text: originalText,
					enhancedText: correctedText,
					style: editingStyle,
				}),
			});

			// Обрабатываем ошибки авторизации от middleware
			if (result.status === 401) {
				const errorData = await result.json();
				toast.error(errorData.error || "Authentication required", {
					description:
						errorData.message ||
						"Please log in to use this feature",
					action: {
						label: "Go to Login",
						onClick: () =>
							router.push(errorData.redirectUrl || "/login"),
					},
				});
				return;
			}

			if (!result.ok) {
				throw new Error(`HTTP error! status: ${result.status}`);
			}

			const data: ErrorsExplanationsResponse = await result.json();
			setErrors(data.errors);
		} catch (error) {
			toast.error("Failed to explain errors", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		} finally {
			setIsErrorsLoading(false);
		}
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(correctedText);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy text:", error);
		}
	};

	const handleTranslate = () => {
		// const encodedText = encodeURIComponent(correctedText);
		router.push("/");
		setInputText(correctedText);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className="min-w-[80vw] md:max-w-4xl max-h-[70vh] overflow-y-auto p-4 sm:p-6"
				aria-describedby="grammar-check-preview-modal"
			>
				<DialogHeader className="pb-3 sm:pb-4">
					<DialogTitle className="text-lg sm:text-xl font-bold text-grammar-text">
						Enhance your text with AI
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 sm:space-y-6">
					{/* Style Selector */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<StyleSelector
							value={editingStyle}
							onValueChange={onStyleChange}
							className="flex-1"
						/>
						{/* Action Buttons */}
						<div className="flex-1 flex flex-col gap-2">
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={handleTranslate}
									disabled={isLoading}
									className="flex-1"
								>
									<Languages className="h-4 w-4" />
									Translate
								</Button>
								<Button
									variant="outline"
									onClick={onApplyChanges}
									disabled={isLoading}
									className="flex-1"
								>
									<MousePointerClick className="h-4 w-4" />
									<span className="hidden sm:inline">
										Apply Changes
									</span>
									<span className="sm:hidden">Apply</span>
								</Button>
							</div>
							<div className="flex flex-row gap-2 justify-end">
								<Button
									variant="outline"
									// size="lg"
									onClick={handleExplainErrors}
									disabled={isLoading || isErrorsLoading}
									className="flex items-center justify-center gap-2 flex-1"
								>
									<Info className="h-4 w-4" />
									<span className="hidden sm:inline">
										Explain Errors
									</span>
									<span className="sm:hidden">Explain</span>
								</Button>
								<Button
									variant="outline"
									// size="lg"
									onClick={onRegenerate}
									disabled={isLoading}
									className="flex items-center justify-center gap-2 flex-1"
								>
									<RotateCcw className="h-4 w-4" />
									<span className="hidden sm:inline">
										Regenerate
									</span>
									<span className="sm:hidden">Regen</span>
								</Button>
								<Button
									variant="outline"
									// size="lg"
									onClick={handleCopy}
									disabled={isLoading}
									className="flex items-center justify-center gap-2 flex-1"
								>
									{copied ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
									{copied ? "Copied!" : "Copy"}
								</Button>
							</div>
						</div>
					</div>

					{/* Text Comparison */}
					<TextDiff
						originalText={originalText}
						correctedText={correctedText}
						// changes={changes}
						correctedWithDiffText={correctedWithDiffText}
					/>

					{/* Errors Explanations with loading skeleton */}
					{isErrorsLoading && <Skeleton className="h-30 w-full" />}
					{errors.length > 0 && !isErrorsLoading && (
						<ErrorExplanations errors={errors} />
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
