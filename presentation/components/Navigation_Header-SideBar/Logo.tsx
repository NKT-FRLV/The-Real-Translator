import Link from "next/link";

interface LogoProps {
	className?: string;
	size?: number;
	href?: string;
	responsive?: boolean; // новый пропс для адаптивного режима
}

const Logo: React.FC<LogoProps> = ({ 
	className, 
	size = 200, 
	href = "/", 
	responsive = false 
}) => {
	// Адаптивные размеры через Tailwind классы (уменьшены для desktop в 1.5 раза)
	const responsiveClasses = responsive 
		? "w-10 h-10 sm:w-14 sm:h-14 md:w-12 md:h-12" 
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
