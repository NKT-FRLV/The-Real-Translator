// import Image from "next/image";
import LanguageSelector from "@/presentation/components/LanguageSelector";
import { TranslatorBox } from "@/presentation/components/TranslatorBox";
import { AppDescription } from "@/presentation/components/AppDescription";
import SideMenu from "@/presentation/components/Side-Menu/SideMenu";

export default function Home() {
	return (
		<div className="w-full h-full flex justify-start gap-4">
			<SideMenu />
			<div className="ml-30 flex flex-col gap-4 w-full h-full items-center justify-start md:justify-center">
				<LanguageSelector />
				<TranslatorBox />
				<AppDescription />
			</div>
		</div>
	);
}
