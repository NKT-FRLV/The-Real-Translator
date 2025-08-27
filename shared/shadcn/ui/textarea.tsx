import * as React from "react";

import { cn } from "@/shared/shadcn/utils";

function Textarea({
	className,
	...props
}: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"placeholder:text-muted-foreground outline-none",
				"focus:outline-none focus:ring-0 focus:border-0",
				"focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0",
				"aria-invalid:ring-0 dark:aria-invalid:ring-0",
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
