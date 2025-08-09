// import Image from "next/image";
import { TranslatorBox } from "@/presentation/boxes/TranslatorBox";
import { AppDescription } from "@/presentation/boxes/AppDescription";
import ResponsiveLayout from "@/presentation/components/Layout/ResponsiveLayout";

export default function Home() {
	return (
		<ResponsiveLayout>
			<TranslatorBox />
			<AppDescription />
		</ResponsiveLayout>
	);
}
