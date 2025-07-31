import Link from "next/link";
import Image from "next/image";

interface LogoProps {
	className?: string;
	size?: number;
	href?: string;
	responsive?: boolean; // новый пропс для адаптивного режима
}

const Logo: React.FC<LogoProps> = ({ 
	className, 
	size = 80, 
	href = "/", 
	responsive = false 
}) => {
	// Адаптивные размеры через Tailwind классы
	const responsiveClasses = responsive 
		? "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16" 
		: "";

	return (
		<Link
			href={href}
			className={`${className}`}
		>
			{/* <Image src="/logo_T.png" alt="Logo" width={80} height={80} className={`${responsiveClasses}`} /> */}
			<svg 
				width={responsive ? undefined : size} 
				height={responsive ? undefined : size}
				className={`cursor-pointer ${responsiveClasses}`}
			>
				<use href="/sprites.svg#translator-logo" />
			</svg>
		</Link>
	);
};

export default Logo;
