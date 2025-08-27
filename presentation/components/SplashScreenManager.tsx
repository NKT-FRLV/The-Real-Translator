"use client";

import { useEffect } from "react";

export function SplashScreenManager() {
	useEffect(() => {
		// Скрываем splash screen когда приложение загружено
		const hideSplashScreen = () => {
			// Добавляем класс для скрытия splash screen
			document.body.classList.add('loaded');
			
			// Для iOS
			if ('standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone) {
				// Приложение запущено в standalone режиме
				// Splash screen автоматически скрывается
			}
			
			// Для Android и других платформ
			if ('serviceWorker' in navigator) {
				// Splash screen скрывается автоматически после загрузки
			}
		};

		// Скрываем splash screen когда DOM загружен
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', hideSplashScreen);
		} else {
			hideSplashScreen();
		}

		// Скрываем splash screen когда все ресурсы загружены
		window.addEventListener('load', hideSplashScreen);

		return () => {
			document.removeEventListener('DOMContentLoaded', hideSplashScreen);
			window.removeEventListener('load', hideSplashScreen);
		};
	}, []);

	return null;
}
