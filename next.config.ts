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
};

export default nextConfig;
