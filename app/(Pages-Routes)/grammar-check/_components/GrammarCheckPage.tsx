"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { GrammarCheckInput } from "./GrammarCheckInput";
import GrammarCheckModal from "./GrammarCheckModal";
import { EditingStyle } from "./StyleSelector";
import { GrammarCheckResponse } from "./grammar-schema";

// Real API call to grammar check service
const checkGrammarWithAI = async (
	text: string,
	style: EditingStyle,
	retry: boolean = false
): Promise<GrammarCheckResponse> => {
	try {
		const response = await fetch("/api/grammar", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text,
				style,
				retry,
			}),
		});

		if (!response.ok) {
			throw new Error(`Grammar check failed: ${response.statusText}`);
		}

		// Parse the JSON response
		const data = await response.json();

		return {
			correctedText: data.correctedText || text,
			correctedWithDiffText: data.correctedWithDiffText || "",
		};
	} catch (error) {
		console.error("Grammar check API error:", error);
		throw new Error("Failed to check grammar. Please try again.");
	}
};

export default function GrammarCheckPage() {
	const [inputText, setInputText] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [editingStyle, setEditingStyle] = useState<EditingStyle>("neutral");

	// Results from grammar check
	const [correctedText, setCorrectedText] = useState("");
	//   const [errors, setErrors] = useState<GrammarError[]>([]);
	const [correctedWithDiffText, setCorrectedWithDiffText] = useState("");

	const handleCheckGrammar = async () => {
		if (!inputText.trim()) return;

		if (correctedText && correctedWithDiffText) {
			setIsModalOpen(true);
			return;
		}

		setIsLoading(true);
		try {
			const result = await checkGrammarWithAI(inputText, editingStyle);
			setCorrectedText(result.correctedText);
			setCorrectedWithDiffText(result.correctedWithDiffText || "");
			setIsModalOpen(true);
		} catch (error) {
			console.error("Grammar check failed:", error);
			toast.error("Grammar check failed", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleApplyChanges = () => {
		setInputText(correctedText);
		setCorrectedWithDiffText("");
		setCorrectedText("");
		setIsModalOpen(false);
	};

	const handleInputChange = (value: string) => {
		setInputText(value);
		setCorrectedWithDiffText("");
		setCorrectedText("");
	};

	const handleRegenerate = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await checkGrammarWithAI(
				inputText,
				editingStyle,
				true
			);
			setCorrectedText(result.correctedText);
			setCorrectedWithDiffText(result.correctedWithDiffText || "");
		} catch (error) {
			console.error("Regeneration failed:", error);
			toast.error("Regeneration failed", {
				description:
					error instanceof Error ? error.message : "Please try again",
			});
		} finally {
			setIsLoading(false);
		}
	}, [inputText, editingStyle]);

	return (
		<div className="relative z-20 w-full mt-14 md:mt-0 max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
			<div className="text-center space-y-2">
				<h1 className="font-orbitron bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-4xl md:text-7xl font-bold text-transparent">
					Grammar Check
				</h1>
				<p className="font-inter text-sm sm:text-base lg:text-lg text-grammar-text-muted px-2">
					Improve your writing with AI-powered grammar checking and
					style suggestions
				</p>
			</div>

			<GrammarCheckInput
				value={inputText}
				onChange={handleInputChange}
				onCheckGrammar={handleCheckGrammar}
				isLoading={isLoading}
			/>

			<GrammarCheckModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				originalText={inputText}
				correctedText={correctedText}
				editingStyle={editingStyle}
				onStyleChange={setEditingStyle}
				onRegenerate={handleRegenerate}
				onApplyChanges={handleApplyChanges}
				isLoading={isLoading}
				correctedWithDiffText={correctedWithDiffText}
			/>
		</div>
	);
}
