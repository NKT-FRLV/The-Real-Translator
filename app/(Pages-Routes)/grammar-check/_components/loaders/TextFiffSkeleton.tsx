import React from 'react'
import { Skeleton } from '@/shared/shadcn/ui/skeleton'

const TextFiffSkeleton = () => {
  return (
	<>
	{/* <div className={cn("space-y-3 sm:space-y-4", className)}>
			<div className="rounded-lg border border-grammar-border bg-grammar-bg-secondary p-3 sm:p-4">
				<h4 className="mb-2 text-sm md:text-base font-medium text-grammar-text">
					Enhanced Result:
				</h4>
				{correctedWithDiffText && renderTextWithDiffMarkers()}
			</div>

			<div className="rounded-lg border border-grammar-border bg-grammar-bg p-3 sm:p-4">
				<h4 className="mb-2 text-xs sm:text-sm md:text-base font-medium text-grammar-text">
					Result:
				</h4>
				<div className="text-xs sm:text-sm md:text-base text-grammar-text leading-relaxed">
					{correctedText}
				</div>
			</div>
		</div> */}
    <div className="space-y-3 sm:space-y-4">
      {/* Enhanced Result skeleton */}
      <div className="rounded-lg border border-grammar-border bg-grammar-bg-secondary p-3 sm:p-4">
        <Skeleton className="h-5 w-32 mb-2" /> {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Result skeleton */}
      <div className="rounded-lg border border-grammar-border bg-grammar-bg p-3 sm:p-4">
        <Skeleton className="h-5 w-20 mb-2" /> {/* Title skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
	</>
  )
}

export default TextFiffSkeleton