"use client";

import { useEffect } from "react";

export function ServiceWorkerManager() {
	useEffect(() => {
		// Простая регистрация Service Worker для кэширования статики
		if (
			typeof window !== "undefined" &&
			"serviceWorker" in navigator
		) {
			const registerSW = async () => {
				try {
					await navigator.serviceWorker.register("/sw.js", {
						scope: "/",
					});
					console.log("Service Worker registered for static caching");
				} catch (error) {
					console.error("Service Worker registration failed:", error);
				}
			};
			
			registerSW();
		}
	}, []);

	return null;
}
