"use client";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "next-auth/react";
import LikedTransCard from "../LikedTransCard";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Translation } from "@prisma/client";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
	InfiniteData,
} from "@tanstack/react-query";
import { likeTranslation } from "@/presentation/API/like/likeApi";

type LikedTranslationsResponse = {
	translations: Translation[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

type OptimisticCtx = {
	previous?: InfiniteData<LikedTranslationsResponse>;
	removedItem: Translation | null;
	pageIndex: number;
	itemIndex: number;
};

const QUERY_KEY = ["liked-translations"];

const fetchLiked = async (page = 1): Promise<LikedTranslationsResponse> => {
	const res = await fetch(`/api/translations/liked?page=${page}&limit=10`);
	if (!res.ok) throw new Error("Failed to fetch liked translations");
	return res.json();
};

const LikedTranslationsTab = () => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();

	const {
		data,
		error,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: QUERY_KEY,
		queryFn: ({ pageParam = 1 }) => fetchLiked(pageParam),
		getNextPageParam: (lastPage) => {
			const { page, totalPages } = lastPage.pagination;
			return page < totalPages ? page + 1 : undefined;
		},
		initialPageParam: 1,
		enabled: !!session?.user?.id,
	});

	const flatTranslations: Translation[] =
		data?.pages.flatMap((p) => p.translations) ?? [];

	// Мутация "удалить" (на деле — дизлайк). Оптимистически удаляем из кэша.
	// вернуть лайк (Undo)
	const likeBackMutation = useMutation<
		string, // TData
		Error, // TError
		string // TVariables (id)
	>({
		mutationFn: async (id: string) => {
			const res = await likeTranslation(id, true);
			if (!res.success) throw new Error(res.error || "Failed to restore");
			return id;
		},
		onError: () => {
			toast.error(
				"The transfer could not be returned. Refresh the page."
			);
		},
	});

	// удалить (на деле — дизлайк) с оптимистическим UI
	const unlikeMutation = useMutation<
		string, // TData
		Error, // TError
		string, // TVariables (id)
		OptimisticCtx // TContext
	>({
		mutationFn: async (id: string) => {
			const res = await likeTranslation(id, false);
			if (!res.success) throw new Error(res.error || "Failed to delete");
			return id;
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: QUERY_KEY });
			const previous =
				queryClient.getQueryData<
					InfiniteData<LikedTranslationsResponse>
				>(QUERY_KEY);

			let removedItem: Translation | null = null;
			let pageIndex = -1;
			let itemIndex = -1;

			if (previous) {
				const pages = previous.pages.map((page, pi) => {
					const idx = page.translations.findIndex((t) => t.id === id);
					if (idx !== -1) {
						removedItem = page.translations[idx];
						pageIndex = pi;
						itemIndex = idx;
						return {
							...page,
							translations: [
								...page.translations.slice(0, idx),
								...page.translations.slice(idx + 1),
							],
						};
					}
					return page;
				});

				queryClient.setQueryData<
					InfiniteData<LikedTranslationsResponse>
				>(QUERY_KEY, {
					...previous,
					pages,
				});
			}

			return { previous, removedItem, pageIndex, itemIndex };
		},
		onError: (_err, _id, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(QUERY_KEY, ctx.previous);
			}
			toast.error("Could not delete translation!!");
		},
		onSuccess: (_id, _vars, ctx) => {
			if (!ctx?.removedItem) return;

			const removed = ctx.removedItem;
			const pageIndex = ctx.pageIndex;
			const itemIndex = ctx.itemIndex;

			const restore = () => {
				// вернуть в кэш на прежнее место
				queryClient.setQueryData<
					InfiniteData<LikedTranslationsResponse>
				>(QUERY_KEY, (current) => {
					if (!current) return current;
					const pages = current.pages.map((page, pi) => {
						if (pi === pageIndex) {
							const arr = [...page.translations];
							const pos = Math.min(
								Math.max(itemIndex, 0),
								arr.length
							);
							arr.splice(pos, 0, removed);
							return { ...page, translations: arr };
						}
						return page;
					});
					return { ...current, pages };
				});

				// Фоном вернём лайк
				likeBackMutation.mutate(removed.id);
			};

			toast.success("Translation deleted", {
				action: { label: "Return it!", onClick: restore },
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEY });
		},
	});

	const onCopy = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success("Copied to clipboard");
		} catch {
			toast.error("Failed to copy");
		}
	};

	const onDelete = (id: string) => {
			// Без лоадера на кнопке — элемент сразу исчезает
			unlikeMutation.mutate(id);
		}

	if (!session?.user?.id) {
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
				<p className="text-red-500 mb-4">
					{(error as Error).message ?? "Failed to load translations"}
				</p>
				<button
					onClick={() => refetch()}
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

			{isLoading && flatTranslations.length === 0 ? (
				<div className="flex-1 flex items-center justify-center">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary sm:h-8 sm:w-8" />
				</div>
			) : flatTranslations.length === 0 ? (
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
							{flatTranslations.map((translation) => (
								<motion.li
									className="w-full"
									key={translation.id}
									exit={{ opacity: 0 }}
									layout
								>
									<LikedTransCard
										translation={translation}
										onCopy={onCopy}
										onDelete={onDelete}
									/>
								</motion.li>
							))}
						</AnimatePresence>
					</ul>

					{hasNextPage && (
						<div className="mt-4 text-center sm:mt-6">
							<button
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
								className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-6 sm:text-base"
							>
								{isFetchingNextPage
									? "Loading..."
									: "Load More"}
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default LikedTranslationsTab;
