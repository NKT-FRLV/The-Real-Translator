
// import Image from "next/image";
import { TranslatorBox } from "@/presentation/boxes/TranslatorBox";
import { AppDescription } from "@/presentation/boxes/AppDescription";
import Footer from "@/presentation/components/footer/Footer";
// import { ClientWarmer } from "@/presentation/components/ClientWarmer";
// import { authCached } from "@/app/lib/authCached";


export default function Home() {

	return (
		<main className="row-start-2 md:row-start-1 md:col-start-2 px-0 md:px-2 md:py-2 flex flex-col items-center sm:items-start">
			{/* Warm up the translation server component*/}
			{/* <ClientWarmer /> */}

			<TranslatorBox />
			<AppDescription />
			<Footer />
		</main>
	);
}
