"use client";

import React from "react";
import { cn } from "@/shared/shadcn/utils";
import TextDiffSkeleton from "./loaders/TextDiffSkeleton";

// import { TextChange } from "./grammar-schema";

// // Локальный тип для парсинга diff текста
type DiffMarker = {
	type: "deleted" | "added" | "unchanged";
	content: string;
	originalText: string;
	correctedText: string;
};

interface TextDiffProps {
	originalText?: string;
	correctedText: string;
	// changes: TextChange[];
	correctedWithDiffText?: string;
	className?: string;
}

export function TextDiff({
	originalText,
	correctedText,
	// changes,
	correctedWithDiffText,
	className,
}: TextDiffProps) {
	// Парсер для нового формата с XML-тегами
	const parseDiffText = (diffText: string): DiffMarker[] => {
		const markers: DiffMarker[] = [];
		let currentIndex = 0;

		// Регулярное выражение для поиска XML-тегов
		// Ищем <del>text</del> или <ins>text</ins>
		const markerRegex = /(<del>.*?<\/del>|<ins>.*?<\/ins>)/g;
		let match;

		while ((match = markerRegex.exec(diffText)) !== null) {
			const marker = match[0];
			const start = match.index;
			const end = start + marker.length;

			// Добавляем текст до маркера как unchanged
			if (start > currentIndex) {
				const beforeText = diffText.slice(currentIndex, start);
				if (beforeText.trim()) {
					// Только если есть текст
					markers.push({
						type: "unchanged",
						content: beforeText,
						originalText: "",
						correctedText: "",
					});
				}
			}

			// Обрабатываем маркер
			if (marker.startsWith("<del>") && marker.endsWith("</del>")) {
				// Удалённый текст
				const content = marker.slice(5, -6); // Убираем <del> и </del>
				markers.push({
					type: "deleted",
					content: content,
					originalText: content,
					correctedText: "",
				});
			} else if (
				marker.startsWith("<ins>") &&
				marker.endsWith("</ins>")
			) {
				// Добавленный текст
				const content = marker.slice(5, -6); // Убираем <ins> и </ins>
				markers.push({
					type: "added",
					content: content,
					originalText: "",
					correctedText: content,
				});
			}

			currentIndex = end;
		}

		// Добавляем оставшийся текст
		if (currentIndex < diffText.length) {
			const remainingText = diffText.slice(currentIndex);
			if (remainingText.trim()) {
				// Только если есть текст
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
			<div className="text-sm md:text-base text-grammar-text leading-relaxed">
				{markers.map((marker, index) => {
					switch (marker.type) {
						case "deleted":
							return (
								<span
									key={`del-${index}`}
									className="text-[#595d62]/90 line-through px-1 rounded font-bold"
								>
									{marker.content}
								</span>
							);
						case "added":
							return (
								<span
									key={`add-${index}`}
									className="bg-grammar-success-bg text-grammar-success px-1 rounded font-bold"
								>
									{marker.content}
								</span>
							);
						case "unchanged":
						default:
							return (
								<span
									className="font-bold"
									key={`unch-${index}`}
								>
									{marker.content}
								</span>
							);
					}
				})}
			</div>
		);
	};

	return (
		<div className={cn("space-y-3 sm:space-y-4", className)}>
			<div className="rounded-lg border border-grammar-border bg-grammar-bg-secondary p-3 sm:p-4">
				<h4 className="mb-2 text-sm md:text-base font-medium text-grammar-text">
					Enhanced Result:
				</h4>
				{correctedWithDiffText ? (
					renderTextWithDiffMarkers()
				) : (
					<TextDiffSkeleton
						text={
							originalText ||
							"This text will be on background invisible. This is a sample text that will be processed by AI to improve grammar and style. The skeleton will adapt to this text size."
						}
						className="text-sm md:text-base text-grammar-text leading-relaxed"
					/>
				)}
			</div>

			<div className="rounded-lg border border-grammar-border bg-grammar-bg p-3 sm:p-4">
				<h4 className="mb-2 text-xs sm:text-sm md:text-base font-medium text-grammar-text">
					Result:
				</h4>
				<div className="text-xs sm:text-sm md:text-base text-grammar-text leading-relaxed">
					{correctedText ? (
						correctedText
					) : (
						<TextDiffSkeleton
							text={
								originalText ||
								"This is a sample text that will be processed by AI to improve grammar and style. The skeleton will adapt to this text size and show realistic loading animation."
							}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
