import { Dispatch, SetStateAction } from "react";
import type {
	Tab,
	TabType,
} from "@/app/(Pages-Routes)/profile/_components/boxes/SettingsWindow";

interface TabButtonProps {
	tab: Tab;
	activeTab: TabType;
	activate: Dispatch<SetStateAction<TabType>>;
}

const TabButton = ({ tab, activeTab, activate }: TabButtonProps) => {
	const IconComponent = tab.icon;
	return (
		<button
			onClick={() => activate(tab.id)}
			className={`flex items-center space-x-1 sm:space-x-2 py-3 px-2 sm:py-4 sm:px-3 border-b-2 transition-colors whitespace-nowrap min-w-0 ${
				activeTab === tab.id
					? "border-primary text-primary"
					: "border-transparent text-muted-foreground hover:text-foreground"
			}`}
		>
			<IconComponent className="w-4 h-4 flex-shrink-0" />
			<span className="text-xs sm:text-sm font-medium hidden xs:inline">
				{tab.label}
			</span>
			{/* Mobile only icons with short labels */}
			<span className="text-xs sm:text-sm md:text-md font-medium xs:hidden">
				{tab.label}
			</span>
		</button>
	);
};

export default TabButton;
