// import Image from "next/image";
import { TranslatorBox } from "@/presentation/boxes/TranslatorBox";
import { AppDescription } from "@/presentation/boxes/AppDescription";
import Footer from "@/presentation/components/footer/Footer";
import { ClientWarmer } from "@/presentation/components/ClientWarmer";

export default function Home() {
	return (
		<>
			{/* Warm up the translation server component*/}
			<ClientWarmer />
		{/* <ResponsiveLayout> */}
			<TranslatorBox />
			<AppDescription />
			<Footer />
		{/* </ResponsiveLayout> */}
		</>
		
	);
}
