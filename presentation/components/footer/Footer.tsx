import React from "react";
import Image from "next/image";

const Footer = () => {
	return (
		<footer className="max-w-[300px] md:max-w-full row-start-3 flex gap-12 flex-wrap items-center justify-center pt-20">
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image
					aria-hidden
					src="/file.svg"
					alt="File icon"
					width={16}
					height={16}
				/>
				Learn
			</a>
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4"
				href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image
					aria-hidden
					src="/window.svg"
					alt="Window icon"
					width={16}
					height={16}
				/>
				Examples
			</a>
			<a
				className="flex items-center gap-2 hover:underline hover:underline-offset-4 tracking-wide"
				href="https://github.com/NKT-FRLV"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Image
					aria-hidden
					src="/globe.svg"
					alt="Globe icon"
					width={16}
					height={16}
				/>
				Go to NKT.FRLV&apos;s GitHub →
			</a>
		</footer>
	);
};

export default Footer;
