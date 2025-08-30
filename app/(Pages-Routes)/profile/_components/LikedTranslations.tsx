"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import LikedTransCard from "./LikedTransCard";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Translation } from "@prisma/client";
import { likeTranslation } from "@/presentation/API/like/likeApi";
import type { LikeTranslationResult } from "@/presentation/API/like/likeApi";

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
	const [isDeliting, setIsDeliting] = useState(false);
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

	const deleteTranslation = async (translationId: string) => {
		setIsDeliting(true);
		const result: LikeTranslationResult = await likeTranslation(
			translationId,
			false
		).finally(() => setIsDeliting(false));
		if (result.success) {
			toast.success("Translation deleted");
			setTranslations((prev) =>
				prev.filter((t) => t.id !== translationId)
			);
		} else {
			toast.error("Failed to delete translation");
		}
	};

	// const formatDate = (dateString: string) => {
	// 	return new Date(dateString).toLocaleDateString("en-US", {
	// 		year: "numeric",
	// 		month: "short",
	// 		day: "numeric",
	// 	});
	// };

	const loadMore = () => {
		if (page < totalPages && !loading) {
			fetchLikedTranslations(page + 1);
		}
	};

	// if (!session?.user) {
	// 	return (
	// 		<div className="flex flex-col items-center justify-center h-full text-center">
	// 			<Heart className="w-12 h-12 text-muted-foreground mb-4" />
	// 			<p className="text-muted-foreground">
	// 				Please sign in to view your liked translations
	// 			</p>
	// 		</div>
	// 	);
	// }

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
				<h2 className="text-lg font-bold mb-1 sm:text-xl md:text-2xl sm:mb-2">
					Liked Translations
				</h2>
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
					<ul className="flex flex-col flex-1 gap-2 w-full h-full md:gap-4 overflow-hidden">
						<AnimatePresence initial={false} mode="popLayout">
							{translations.map((translation) => (
								// Карточкаи лайкнутых переводов
								<motion.li
									className="w-full"
									key={translation.id}
									exit={{ opacity: 0 }}
									layout
								>
									<LikedTransCard
										translation={translation}
										onCopy={onCopy}
										onDelete={deleteTranslation}
										isDeliting={isDeliting}
									/>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>

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
