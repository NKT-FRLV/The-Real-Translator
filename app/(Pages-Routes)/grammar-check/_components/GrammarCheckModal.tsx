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
import { RotateCcw, Copy, Check, Info } from "lucide-react";
import { ErrorsExplanationsResponse, GrammarError } from "./grammar-schema";
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
					description: errorData.message || "Please log in to use this feature",
					action: {
						label: "Go to Login",
						onClick: () => router.push(errorData.redirectUrl || "/login"),
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
						<div className="flex flex-row gap-2 sm:flex-row sm:justify-end flex-1">
							<Button
								variant="outline"
								size="lg"
								onClick={handleExplainErrors}
								disabled={isLoading || isErrorsLoading}
								className="flex items-center justify-center gap-2"
							>
								<Info className="h-4 w-4" />
								<span className="hidden sm:inline">
									Explain Errors
								</span>
								<span className="sm:hidden">Explain</span>
							</Button>
							<Button
								variant="outline"
								size="lg"
								onClick={onRegenerate}
								disabled={isLoading}
								className="flex items-center justify-center gap-2 sm:w-auto"
							>
								<RotateCcw className="h-4 w-4" />
								<span className="hidden sm:inline">
									Regenerate
								</span>
								<span className="sm:hidden">Regen</span>
							</Button>
							<Button
								variant="outline"
								size="lg"
								onClick={handleCopy}
								className="flex items-center justify-center gap-2 sm:w-auto"
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

					{/* {originalText && (
						<div className="rounded-lg border border-grammar-border bg-grammar-bg-secondary p-3 sm:p-4">
							<h4 className="mb-2 text-xs sm:text-sm md:text-base font-medium text-grammar-text">
								Source text:
							</h4>
							<div className="text-xs sm:text-sm md:text-base text-grammar-text leading-relaxed">
								{originalText}
							</div>
						</div>
					)} */}

					{/* Text Comparison */}
					<TextDiff
						originalText={originalText}
						correctedText={correctedText}
						// changes={changes}
						correctedWithDiffText={correctedWithDiffText}
					/>

					{errors.length > 0 && <ErrorExplanations errors={errors} />}

					{/* Action Buttons */}
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end pt-4 border-t border-grammar-border">
						<Button
							variant="outline"
							onClick={onClose}
							className="w-full sm:w-auto order-2 sm:order-1"
						>
							Cancel
						</Button>
						<Button
							onClick={onApplyChanges}
							disabled={isLoading}
							className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2"
						>
							{isLoading ? "Processing..." : "Apply Changes"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
