import { Skeleton } from "@/shared/shadcn/ui/skeleton";
import { cn } from "@/shared/shadcn/utils";


const TextDiffSkeleton = ({
	text,
	className,
}: {
	text: string;
	className?: string;
}) => {
	return (
		<div className={cn("relative", className)}>
			{/* Невидимый текст для определения размеров */}
			<div className="invisible text-sm md:text-base leading-relaxed">
				<span className="font-bold">{text}</span>
			</div>
			{/* Скелетон поверх невидимого текста с анимацией */}
			<div className="absolute inset-0">
				<div className="relative h-full w-full overflow-hidden">
					<Skeleton className="h-full w-full animate-pulse" />
				</div>
			</div>
		</div>
	);
}

export default TextDiffSkeleton;
