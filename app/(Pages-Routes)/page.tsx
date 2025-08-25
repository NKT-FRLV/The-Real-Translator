// import Image from "next/image";
import { TranslatorBox } from "@/presentation/boxes/TranslatorBox";
import { AppDescription } from "@/presentation/boxes/AppDescription";
import Footer from "@/presentation/components/footer/Footer";

export default function Home() {
	return (
		<>
		{/* <ResponsiveLayout> */}
			<TranslatorBox />
			<AppDescription />
			<Footer />
		{/* </ResponsiveLayout> */}
		</>
		
	);
}
