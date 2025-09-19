"use client";

import React from "react";
import { cn } from "@/shared/shadcn/utils";
import { TextChange } from "./grammar-schema";

// Локальный тип для парсинга diff текста
type DiffMarker = {
	type: "deleted" | "added" | "unchanged";
	content: string;
	originalText: string;
	correctedText: string;
};

interface TextDiffProps {
	originalText: string;
	correctedText: string;
	changes: TextChange[];
	correctedWithDiffText?: string;
	className?: string;
}

export function TextDiff({
	originalText,
	correctedText,
	changes,
	correctedWithDiffText,
	className,
}: TextDiffProps) {
	// Парсер для нового формата с маркерами
	const parseDiffText = (diffText: string): DiffMarker[] => {
		const markers: DiffMarker[] = [];
		let currentIndex = 0;
		
		// Регулярное выражение для поиска маркеров
		// Ищем -text- или +text+ но не -text+ или +text-
		const markerRegex = /(-[^-]+-|\+[^+]+\+)/g;
		let match;
		
		while ((match = markerRegex.exec(diffText)) !== null) {
			const marker = match[0];
			const start = match.index;
			const end = start + marker.length;
			
			// Добавляем текст до маркера как unchanged
			if (start > currentIndex) {
				const beforeText = diffText.slice(currentIndex, start);
				if (beforeText.trim()) { // Только если есть текст
					markers.push({
						type: "unchanged",
						content: beforeText,
						originalText: "",
						correctedText: "",
					});
				}
			}
			
			// Обрабатываем маркер
			if (marker.startsWith('-') && marker.endsWith('-')) {
				// Удалённый текст
				markers.push({
					type: "deleted",
					content: marker.slice(1, -1), // Убираем дефисы
					originalText: marker.slice(1, -1),
					correctedText: "",
				});
			} else if (marker.startsWith('+') && marker.endsWith('+')) {
				// Добавленный текст
				markers.push({
					type: "added",
					content: marker.slice(1, -1), // Убираем плюсы
					originalText: "",
					correctedText: marker.slice(1, -1),
				});
			}
			
			currentIndex = end;
		}
		
		// Добавляем оставшийся текст
		if (currentIndex < diffText.length) {
			const remainingText = diffText.slice(currentIndex);
			if (remainingText.trim()) { // Только если есть текст
				markers.push({
					type: "unchanged",
					content: remainingText,
					originalText: "",
					correctedText: "",
				});
			}
		}
		
		return markers;
	};

	// Рендер с новым форматом
	const renderTextWithDiffMarkers = () => {
		if (!correctedWithDiffText) {
			return null;
		}

		const markers = parseDiffText(correctedWithDiffText);
		
		return (
			<div className="text-xs sm:text-sm text-grammar-text leading-relaxed">
				{markers.map((marker, index) => {
					switch (marker.type) {
						case "deleted":
							return (
								<span
									key={`del-${index}`}
									className="bg-grammar-error-bg text-grammar-error line-through px-1 rounded font-medium"
								>
									{marker.content}
								</span>
							);
						case "added":
							return (
								<span
									key={`add-${index}`}
									className="bg-grammar-success-bg text-grammar-success px-1 rounded font-medium"
								>
									{marker.content}
								</span>
							);
						case "unchanged":
						default:
							return (
								<span key={`unch-${index}`}>
									{marker.content}
								</span>
							);
					}
				})}
			</div>
		);
	};

	const renderTextWithChanges = () => {
		if (changes.length === 0) {
			return (
				<div className="text-grammar-text-muted">
					No changes needed. Your text is already well-written!
				</div>
			);
		}

		// Validate and sort changes by start position
		const validChanges = changes
			.filter(change => 
				change.start >= 0 && 
				change.end >= change.start && 
				change.start < originalText.length &&
				change.end <= originalText.length
			)
			.sort((a, b) => a.start - b.start);

		// Check for overlapping changes
		const hasOverlaps = validChanges.some((change, index) => {
			if (index === 0) return false;
			const prevChange = validChanges[index - 1];
			return change.start < prevChange.end;
		});

		// If positions are invalid or overlapping, show fallback
		if (validChanges.length === 0 || hasOverlaps) {
			return (
				<div className="space-y-2">
					<div className="text-grammar-text-muted text-sm">
						Changes detected but positions are invalid or overlapping. Showing original text:
					</div>
					<div className="text-grammar-text text-sm font-mono bg-grammar-bg-secondary p-2 rounded border">
						{originalText}
					</div>
				</div>
			);
		}

		let lastIndex = 0;
		const elements: React.ReactNode[] = [];

		validChanges.forEach((change, index) => {
			// Add text before the change
			if (change.start > lastIndex) {
				elements.push(
					<span key={`text-${index}`}>
						{originalText.slice(lastIndex, change.start)}
					</span>
				);
			}

			// Add the change with proper highlighting
			switch (change.type) {
				case "deletion":
					elements.push(
						<span
							key={`del-${index}`}
							className="bg-grammar-error-bg text-grammar-error line-through px-1 rounded font-medium"
						>
							{change.original}
						</span>
					);
					break;
				case "insertion":
					elements.push(
						<span
							key={`ins-${index}`}
							className="bg-grammar-success-bg text-grammar-success px-1 rounded font-medium"
						>
							{change.corrected}
						</span>
					);
					break;
				case "replacement":
					// Show original text with strikethrough
					elements.push(
						<span
							key={`rep-old-${index}`}
							className="bg-grammar-error-bg text-grammar-error line-through px-1 rounded font-medium"
						>
							{change.original}
						</span>
					);
					// Show corrected text
					elements.push(
						<span
							key={`rep-new-${index}`}
							className="bg-grammar-success-bg text-grammar-success px-1 rounded font-medium"
						>
							{change.corrected}
						</span>
					);
					break;
			}

			lastIndex = change.end;
		});

		// Add remaining text
		if (lastIndex < originalText.length) {
			elements.push(
				<span key="text-end">{originalText.slice(lastIndex)}</span>
			);
		}

		return elements;
	};

	return (
		<div className={cn("space-y-3 sm:space-y-4", className)}>
			<div className="rounded-lg border border-grammar-border bg-grammar-bg-secondary p-3 sm:p-4">
				<h4 className="mb-2 text-xs sm:text-sm font-medium text-grammar-text">
					Original Text with Changes
				</h4>
				{correctedWithDiffText ? (
					renderTextWithDiffMarkers()
				) : (
					<div className="text-xs sm:text-sm text-grammar-text leading-relaxed">
						{renderTextWithChanges()}
					</div>
				)}
			</div>

			<div className="rounded-lg border border-grammar-border bg-grammar-bg p-3 sm:p-4">
				<h4 className="mb-2 text-xs sm:text-sm font-medium text-grammar-text">
					Corrected Text
				</h4>
				<div className="text-xs sm:text-sm text-grammar-text leading-relaxed">
					{correctedText}
				</div>
			</div>

			{/* Show changes summary if positions are valid */}
			{changes.length > 0 && (
				<div className="rounded-lg border border-grammar-info-border bg-grammar-info-bg p-3 sm:p-4">
					<h4 className="mb-2 text-xs sm:text-sm font-medium text-grammar-info">
						Changes Summary
					</h4>
					<div className="space-y-2 text-xs">
						{changes.map((change, index) => (
							<div key={index} className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="inline-block h-2 w-2 rounded-full bg-grammar-warning"></span>
									<span className="font-medium text-grammar-text">
										{change.type === "replacement" ? "Replaced" : 
										 change.type === "insertion" ? "Added" : "Removed"}
									</span>
								</div>
								<div className="ml-4 space-y-1">
									{change.type !== "insertion" && (
										<div className="text-grammar-text-muted">
											<span className="font-medium">Original:</span> &ldquo;{change.original}&rdquo;
										</div>
									)}
									{change.type !== "deletion" && (
										<div className="text-grammar-text-muted">
											<span className="font-medium">Corrected:</span> &ldquo;{change.corrected}&rdquo;
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

		</div>
	);
}
