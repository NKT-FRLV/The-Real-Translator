import axios from "axios";

/**
 * Общий API клиент с базовой конфигурацией
 * Используется для всех API запросов в приложении
 */
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 секунд таймаут
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Логируем ошибки в development режиме
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  }
);
