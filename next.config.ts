import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
		  {
			protocol: "https",
			hostname: "lh3.googleusercontent.com",
			pathname: "/**",
		  },
		  { protocol: "https", hostname: "avatars.githubusercontent.com", pathname: "/u/**" },
		  { protocol: "https", hostname: "www.gravatar.com", pathname: "/avatar/**" },
		  { protocol: "https", hostname: "api.dicebear.com", pathname: "/9.x/shapes/svg/**" },
		],
	},
	
	// Упрощенные Security Headers для PWA
	async headers() {
		return [
			{
				// Основные заголовки безопасности
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
				],
			},
			{
				// Service Worker - только базовые заголовки
				source: '/sw.js',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
				],
			},
		];
	},
};

export default nextConfig;
