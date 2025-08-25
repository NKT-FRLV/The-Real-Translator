"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { languages } from "@/shared/config/translation";
import { LanguageShort } from "@/shared/config/translation";
import { Heart, Copy, Calendar, Languages } from "lucide-react";
import { toast } from "sonner";

interface Translation {
	id: string;
	sourceText: string;
	resultText: string;
	sourceLang: LanguageShort;
	targetLang: LanguageShort;
	tone: string;
	model: string;
	isLiked: boolean;
	isPinned: boolean;
	createdAt: string;
}

interface LikedTranslationsResponse {
	translations: Translation[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

const LikedTranslations = () => {
	const { data: session } = useSession();
	const [translations, setTranslations] = useState<Translation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const fetchLikedTranslations = useCallback(
		async (pageNum: number = 1) => {
			if (!session?.user?.id) return;

			try {
				setLoading(true);
				const response = await fetch(
					`/api/translations/liked?page=${pageNum}&limit=10`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch liked translations");
				}

				const data: LikedTranslationsResponse = await response.json();

				if (pageNum === 1) {
					setTranslations(data.translations);
				} else {
					setTranslations((prev) => [...prev, ...data.translations]);
				}

				setPage(data.pagination.page);
				setTotalPages(data.pagination.totalPages);
				setError(null);
			} catch (err) {
				console.error("Error fetching liked translations:", err);
				setError(
					err instanceof Error
						? err.message
						: "Failed to load translations"
				);
			} finally {
				setLoading(false);
			}
		},
		[session?.user?.id]
	);

	useEffect(() => {
		fetchLikedTranslations();
	}, [fetchLikedTranslations]);

	const onCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard");
		} catch {
			toast.error("Failed to copy");
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const loadMore = () => {
		if (page < totalPages && !loading) {
			fetchLikedTranslations(page + 1);
		}
	};

	if (!session?.user) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-center">
				<Heart className="w-12 h-12 text-muted-foreground mb-4" />
				<p className="text-muted-foreground">
					Please sign in to view your liked translations
				</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full text-center">
				<p className="text-red-500 mb-4">{error}</p>
				<button
					onClick={() => fetchLikedTranslations()}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full w-full">
			<div className="mb-4 sm:mb-6">
				<h2 className="text-lg font-bold mb-1 sm:text-xl md:text-2xl sm:mb-2">Liked Translations</h2>
				<p className="text-xs text-muted-foreground sm:text-sm md:text-base">
					Your favorite translations saved for quick access
				</p>
			</div>

			{loading && translations.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary sm:h-8 sm:w-8"></div>
				</div>
			) : translations.length === 0 ? (
				<div className="flex-1 flex flex-col items-center justify-center text-center px-4">
					<Heart className="w-12 h-12 text-muted-foreground mb-3 sm:w-16 sm:h-16 sm:mb-4" />
					<h3 className="text-lg font-semibold mb-2 sm:text-xl">
						No liked translations yet
					</h3>
					<p className="text-xs text-muted-foreground max-w-sm sm:text-sm">
						Start translating and like your favorite results to see
						them here
					</p>
				</div>
			) : (
				<>
					<div className="flex-1 space-y-3 overflow-y-auto sm:space-y-4">
						{translations.map((translation) => (
							<div
								key={translation.id}
								className="bg-card rounded-lg p-3 border border-border shadow-sm hover:shadow-md transition-all duration-200 sm:p-4"
							>
								{/* Header with language info and date - mobile first */}
								<div className="flex flex-col space-y-2 mb-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:mb-4">
									<div className="flex items-center space-x-1 text-xs text-muted-foreground sm:space-x-2 sm:text-sm">
										<Languages className="w-3 h-3 flex-shrink-0 sm:w-4 sm:h-4" />
										<span className="uppercase truncate">
											{languages[translation.sourceLang].label}
										</span>
										<span>→</span>
										<span className="uppercase truncate">
											{languages[translation.targetLang].label}
										</span>
										<span className="hidden xs:inline">•</span>
										<span className="capitalize truncate hidden xs:inline">
											{translation.tone}
										</span>
									</div>
									<div className="flex items-center space-x-1 text-xs text-muted-foreground self-end sm:space-x-2 sm:text-sm sm:self-auto">
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
										<div className="bg-muted/50 rounded-md p-2 border border-border sm:p-3">
											<p className="text-xs leading-relaxed sm:text-sm">
												{translation.sourceText}
											</p>
											<button
												onClick={() => onCopy(translation.sourceText)}
												className="mt-2 p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors sm:p-1.5"
											>
												<Copy className="w-3 h-3 text-muted-foreground hover:text-foreground sm:w-3.5 sm:h-3.5" />
											</button>
										</div>
									</div>

									{/* Translation text */}
									<div>
										<p className="text-xs text-muted-foreground mb-1 font-medium sm:text-sm">
											Translation
										</p>
										<div className="bg-muted/50 rounded-md p-2 border border-border sm:p-3">
											<p className="text-xs leading-relaxed sm:text-sm">
												{translation.resultText}
											</p>
											<button
												onClick={() => onCopy(translation.resultText)}
												className="mt-2 p-1 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors sm:p-1.5"
											>
												<Copy className="w-3 h-3 text-muted-foreground hover:text-foreground sm:w-3.5 sm:h-3.5" />
											</button>
										</div>
									</div>
								</div>

								{/* Show tone on mobile if not visible in header */}
								<div className="mt-2 xs:hidden">
									<span className="text-xs text-muted-foreground">Style: </span>
									<span className="text-xs font-medium capitalize">{translation.tone}</span>
								</div>
							</div>
						))}
					</div>

					{page < totalPages && (
						<div className="mt-4 text-center sm:mt-6">
							<button
								onClick={loadMore}
								disabled={loading}
								className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-6 sm:text-base"
							>
								{loading ? "Loading..." : "Load More"}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default LikedTranslations;
