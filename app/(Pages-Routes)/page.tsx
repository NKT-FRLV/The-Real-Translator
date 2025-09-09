// import Image from "next/image";
import { TranslatorBox } from "@/presentation/boxes/TranslatorBox";
import { AppDescription } from "@/presentation/boxes/AppDescription";
import Footer from "@/presentation/components/footer/Footer";
import { ClientWarmer } from "@/presentation/components/ClientWarmer";


export default async function Home() {
	// const userSettings = await getUserSettingsData()
	
	// Деструктурируем только нужные поля для логов
	// const { defaultSourceLang, defaultTargetLang, translationStyle } = userSettings
	// console.log('User Settings:', { defaultSourceLang, defaultTargetLang, translationStyle })


	return (
		<main className="row-start-2 md:row-start-1 md:col-start-2 px-0 md:px-2 md:py-2 flex flex-col items-center sm:items-start">
			{/* Warm up the translation server component*/}
			<ClientWarmer />
			{/* Layout */}
			<TranslatorBox />
			<AppDescription />
			<Footer />

		</main>
		
	);
}
