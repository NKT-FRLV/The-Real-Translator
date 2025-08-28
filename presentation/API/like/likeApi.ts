import { AxiosError } from "axios";
import { apiClient } from "@/presentation/API/client";
import type { 
  TranslationLikeResponse, 
  ApiErrorResponse, 
  LikeRequestData 
} from "@/shared/types/types";

export interface LikeTranslationResult {
  success: boolean;
  data?: TranslationLikeResponse;
  error?: string;
}

/**
 * Лайкает или дизлайкает перевод
 * @param translationId - ID перевода
 * @param liked - статус лайка (true - лайк, false - дизлайк)
 * @returns Promise с результатом операции
 */
export const likeTranslation = async (
  translationId: string,
  liked: boolean
): Promise<LikeTranslationResult> => {
  try {
    const requestData: LikeRequestData = { liked };
    
    const response = await apiClient.post<TranslationLikeResponse>(
      `/translations/${translationId}/like`,
      requestData
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      if (axiosError.response?.status === 401) {
        return {
          success: false,
          error: "Authentication required. Please sign in to like translations.",
        };
      }
      
      if (axiosError.response?.status === 404) {
        return {
          success: false,
          error: "Translation not found.",
        };
      }
      
      if (axiosError.response?.status === 400) {
        return {
          success: false,
          error: axiosError.response.data?.error || "Invalid request data.",
        };
      }
      
      return {
        success: false,
        error: axiosError.response?.data?.error || "Failed to update like status.",
      };
    }
    
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
};
