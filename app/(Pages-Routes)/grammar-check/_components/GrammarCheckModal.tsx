"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/shadcn/ui/dialog";
import { Button } from "@/shared/shadcn/ui/button";
import { TextDiff } from "./TextDiff";
import { ErrorExplanations } from "./ErrorExplanations";
import StyleSelector, { EditingStyle } from "./StyleSelector";
import { TextChange, GrammarError, DiffMarker } from "./grammar-schema";
import { RotateCcw, Copy, Check } from "lucide-react";

interface GrammarCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  correctedText: string;
  changes: TextChange[];
  errors: GrammarError[];
  editingStyle: EditingStyle;
  onStyleChange: (style: EditingStyle) => void;
  onRegenerate: () => void;
  onApplyChanges: () => void;
  isLoading?: boolean;
  // Новые поля для diff формата
  correctedWithDiffText?: string;
}

export default function GrammarCheckModal({
  isOpen,
  onClose,
  originalText,
  correctedText,
  changes,
  errors,
  editingStyle,
  onStyleChange,
  onRegenerate,
  onApplyChanges,
  isLoading = false,
  correctedWithDiffText,
}: GrammarCheckModalProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(correctedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[80vw] md:max-w-4xl max-h-[70vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl font-bold text-grammar-text">
            Enhance your text with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Style Selector */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <StyleSelector
              value={editingStyle}
              onValueChange={onStyleChange}
              className="flex-1"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end flex-1">
              <Button
                variant="outline"
                size="lg"
                onClick={onRegenerate}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Regenerate</span>
                <span className="sm:hidden">Regen</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Text Comparison */}
          <TextDiff
            originalText={originalText}
            correctedText={correctedText}
            changes={changes}
            correctedWithDiffText={correctedWithDiffText}
          />

          {/* Error Explanations */}
          <ErrorExplanations errors={errors} />

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end pt-4 border-t border-grammar-border">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onApplyChanges}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto order-1 sm:order-2"
            >
              {isLoading ? "Processing..." : "Apply Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
