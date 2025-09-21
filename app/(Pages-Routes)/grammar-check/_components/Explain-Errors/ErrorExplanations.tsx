"use client";

import React from "react";
import { cn } from "@/shared/shadcn/utils";
import { GrammarError } from "../grammar-schema";

interface ErrorExplanationsProps {
  errors: GrammarError[];
  className?: string;
}

const errorTypeLabels = {
  grammar: "Grammar",
  spelling: "Spelling",
  punctuation: "Punctuation", 
  style: "Style",
  clarity: "Clarity",
};

const severityColors = {
  low: "bg-grammar-success-bg text-grammar-success border-grammar-success-border",
  medium: "bg-grammar-warning-bg text-grammar-warning border-grammar-warning-border",
  high: "bg-grammar-error-bg text-grammar-error border-grammar-error-border",
};

const severityLabels = {
  low: "Minor",
  medium: "Moderate", 
  high: "Important",
};

export function ErrorExplanations({
  errors,
  className,
}: ErrorExplanationsProps) {
  if (errors.length === 0) {
    return (
      <div className={cn("rounded-lg border border-grammar-success-border bg-grammar-success-bg p-3 sm:p-4", className)}>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-grammar-success"></div>
          <span className="text-xs sm:text-sm md:text-base font-medium text-grammar-success">
            Great job! No errors found.
          </span>
        </div>
        <p className="mt-1 text-xs sm:text-sm md:text-base text-grammar-text-muted">
          Your text is well-written and follows good grammar practices.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3 sm:space-y-4", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-grammar-text">
          Grammar Analysis
        </h3>
        <span className="rounded-full bg-grammar-bg-secondary px-2 py-1 text-xs sm:text-sm text-grammar-text-muted self-start sm:self-auto">
          {errors.length} {errors.length === 1 ? "issue" : "issues"} found
        </span>
      </div>

      <div className="space-y-3">
        {errors.map((error) => (
          <div
            key={error.id}
            className="rounded-lg border border-grammar-border bg-grammar-bg p-3 sm:p-4"
          >
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  severityColors[error.severity]
                )}
              >
                {severityLabels[error.severity]}
              </span>
              <span className="rounded-full bg-grammar-info-bg px-2 py-1 text-xs font-medium text-grammar-info">
                {errorTypeLabels[error.type]}
              </span>
            </div>

            <div className="mb-3 space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-grammar-text">
                  Original:
                </span>
                <span className="rounded bg-grammar-error-bg px-2 py-1 text-xs sm:text-sm text-grammar-error inline-block w-fit">
                  {error.original}
                </span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <span className="text-xs sm:text-sm font-medium text-grammar-text">
                  Corrected:
                </span>
                <span className="rounded bg-grammar-success-bg px-2 py-1 text-xs sm:text-sm text-grammar-success inline-block w-fit">
                  {error.corrected}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-grammar-text">
                  What was wrong:
                </h4>
                <p className="text-xs sm:text-sm text-grammar-text-muted leading-relaxed">
                  {error.explanation}
                </p>
              </div>
              
              <div>
                <h4 className="text-xs sm:text-sm font-medium text-grammar-text">
                  How to improve:
                </h4>
                <p className="text-xs sm:text-sm text-grammar-text-muted leading-relaxed">
                  {error.suggestion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
