"use client";

import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { GrammarCheckInput } from "./GrammarCheckInput";
import GrammarCheckModal from "./GrammarCheckModal";
import { EditingStyle } from "./StyleSelector";
import { TextChange, GrammarError, GrammarCheckResponse } from "./grammar-schema";
import { getMockData } from "./mockData";


// Real API call to grammar check service
const checkGrammarWithAI = async (
  text: string,
  style: EditingStyle
): Promise<GrammarCheckResponse> => {
  try {
    const response = await fetch('/api/grammar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        style,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grammar check failed: ${response.statusText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    
    return {
      correctedText: data.correctedText || text,
      correctedWithDiffText: data.correctedWithDiffText || "",
      changes: data.changes || [],
      errors: data.errors || [],
    };
  } catch (error) {
    console.error('Grammar check API error:', error);
    throw new Error('Failed to check grammar. Please try again.');
  }
};

// Mock data for testing (uncomment to use)
const checkGrammarWithMock = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _text: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _style: EditingStyle
): Promise<GrammarCheckResponse> => {
  // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Use problematic mock data to test error handling
  return getMockData("problematic");
};

export default function GrammarCheckPage() {
  const [inputText, setInputText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingStyle, setEditingStyle] = useState<EditingStyle>("neutral");
  
  // Results from grammar check
  const [correctedText, setCorrectedText] = useState("");
  const [changes, setChanges] = useState<TextChange[]>([]);
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [correctedWithDiffText, setCorrectedWithDiffText] = useState("");
  
  // Track if we have results to regenerate when style changes
//   const [hasResults, setHasResults] = useState(false);
  
  // Toggle for testing (set to true to use mock data)


  const useMockData = false; // API работает!

  const handleCheckGrammar = async () => {
    if (!inputText.trim()) return;

	if (correctedText && correctedWithDiffText && changes && errors) {
		setIsModalOpen(true);
		return;
	}

    setIsLoading(true);
    try {
      const result = useMockData 
        ? await checkGrammarWithMock(inputText, editingStyle)
        : await checkGrammarWithAI(inputText, editingStyle);
      setCorrectedText(result.correctedText);
      setChanges(result.changes || []);
      setErrors(result.errors);
      setCorrectedWithDiffText(result.correctedWithDiffText || "");
    //   setHasResults(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Grammar check failed:", error);
      toast.error("Grammar check failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyChanges = () => {
    setInputText(correctedText);
	setChanges([]);
	setErrors([]);
	setCorrectedWithDiffText("");
	setCorrectedText("");
    setIsModalOpen(false);
  };


  const handleInputChange = (value: string) => {
    setInputText(value);
	setChanges([]);
	setErrors([]);
	setCorrectedWithDiffText("");
	setCorrectedText("");

  };

  const handleRegenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = useMockData 
        ? await checkGrammarWithMock(inputText, editingStyle)
        : await checkGrammarWithAI(inputText, editingStyle);
      setCorrectedText(result.correctedText);
      setChanges(result.changes || []);
      setErrors(result.errors);
      setCorrectedWithDiffText(result.correctedWithDiffText || "");
    } catch (error) {
      console.error("Regeneration failed:", error);
      toast.error("Regeneration failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }, [inputText, editingStyle, useMockData]);

  // Auto-regenerate when style changes and we have results
//   useEffect(() => {
//     if (hasResults && isModalOpen && inputText.trim()) {
//       handleRegenerate();
//     }
//   }, [editingStyle, hasResults, isModalOpen, inputText, handleRegenerate]);

  return (
    <div className="relative z-20 w-full mt-14 md:mt-0 max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="text-center space-y-2">
        {/* <h1 className="font-orbitron text-2xl sm:text-3xl lg:text-4xl tracking-wide font-bold text-grammar-text">
          Grammar Check
        </h1> */}
		<h1 className="font-orbitron bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-6 text-4xl md:text-7xl font-bold text-transparent">Grammar Check</h1>
        <p className="font-inter text-sm sm:text-base lg:text-lg text-grammar-text-muted px-2">
          Improve your writing with AI-powered grammar checking and style suggestions
        </p>
      </div>

      <GrammarCheckInput
        value={inputText}
        onChange={handleInputChange}
        onCheckGrammar={handleCheckGrammar}
        isLoading={isLoading}
      />

      <GrammarCheckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        originalText={inputText}
        correctedText={correctedText}
        changes={changes}
        errors={errors}
        editingStyle={editingStyle}
        onStyleChange={setEditingStyle}
        onRegenerate={handleRegenerate}
        onApplyChanges={handleApplyChanges}
        isLoading={isLoading}
        correctedWithDiffText={correctedWithDiffText}
      />

	  

    </div>
  );
}
