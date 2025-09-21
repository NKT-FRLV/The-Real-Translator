// import React from "react";
// import { TextChange } from "../grammar-schema";

// const ChangesSummary = ({ changes }: { changes: TextChange[] | null }) => {
// 	if (changes?.length === 0 || changes === null) {
// 		return (
// 			<div className="text-grammar-text-muted">
// 					No changes needed. Your text is already well-written!
// 				</div>
// 		);
// 	}

// 	return (
// 		<div className="rounded-lg border border-grammar-info-border bg-grammar-info-bg p-3 sm:p-4">
// 			<h4 className="mb-2 text-xs sm:text-sm font-medium text-grammar-info">
// 				Changes Summary
// 			</h4>
// 			<div className="space-y-2 text-xs md:text-base">
// 				{changes.map((change, index) => (
// 					<div key={index} className="flex flex-col gap-1">
// 						<div className="flex items-center gap-2">
// 							<span className="inline-block h-2 w-2 rounded-full bg-grammar-warning"></span>
// 							<span className="font-medium text-grammar-text">
// 								{change.type === "replacement"
// 									? "Replaced"
// 									: change.type === "insertion"
// 									? "Added"
// 									: "Removed"}
// 							</span>
// 						</div>
// 						<div className="ml-4 space-y-1">
// 							{change.type !== "insertion" && (
// 								<div className="text-grammar-text-muted">
// 									<span className="font-medium">
// 										Original:
// 									</span>{" "}
// 									&ldquo;{change.original}&rdquo;
// 								</div>
// 							)}
// 							{change.type !== "deletion" && (
// 								<div className="text-grammar-text-muted">
// 									<span className="font-medium">
// 										Corrected:
// 									</span>{" "}
// 									&ldquo;{change.corrected || "nothing"}
// 									&rdquo;
// 								</div>
// 							)}
// 						</div>
// 					</div>
// 				))}
// 			</div>
// 		</div>
// 	);
// };

// export default ChangesSummary;
