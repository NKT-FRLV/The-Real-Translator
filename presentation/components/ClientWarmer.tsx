// presentation/components/ClientWarmer.tsx
"use client";

import { useEffect } from "react";
import { warmupServerConnection } from "@/presentation/API/warmer/warmer";

/**
 * Лёгкий «вармер» API: через 120мс после маунта шлёт HEAD, чтобы
 * разбудить edge-функцию и соединение. Без type assertions.
 */
export const ClientWarmer: React.FC = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      void warmupServerConnection("/api/translate-stream", 800);
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  return null; // сайд-эффект, ничего не рендерим
};
