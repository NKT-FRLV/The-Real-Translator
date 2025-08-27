"use client";

import { useEffect } from "react";

export function SplashScreenManager() {
	useEffect(() => {
		// Проверяем, запущено ли приложение в standalone режиме
		const isStandalone = 'standalone' in window.navigator && (window.navigator as Navigator & { standalone?: boolean }).standalone;
		
		console.log('SplashScreenManager: isStandalone =', isStandalone);
		console.log('SplashScreenManager: display-mode =', window.matchMedia('(display-mode: standalone)').matches);
		
		// В PWA режиме splash screen скрывается автоматически
		// Этот компонент нужен только для отладки
		if (isStandalone) {
			console.log('SplashScreenManager: PWA standalone mode detected');
		}
		
	}, []);

	return null;
}
