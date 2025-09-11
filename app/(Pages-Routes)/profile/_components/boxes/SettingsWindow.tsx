"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Settings, Heart, User as UserIcon, Bell } from "lucide-react";
import TabButton from "../TabButton";
import GeneralTab from "../profile_tabs/GeneralTab";
import LikedTranslationsTab from "../profile_tabs/LikedTranslationsTab";
import Account from "../profile_tabs/Account";
import NotifivationsTab from "../profile_tabs/NotifivationsTab";
import type { User } from "next-auth";

import {
	useLoadSettings,
} from "@/presentation/stores/settingsStore";

export type TabType = "general" | "liked" | "account" | "notifications";

export interface Tab {
	id: TabType;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
	{ id: "general", label: "General", icon: Settings },
	{ id: "liked", label: "Liked", icon: Heart },
	{ id: "account", label: "Account", icon: UserIcon },
	{ id: "notifications", label: "Alerts", icon: Bell },
];

// Mapping query parameters to tab types
const queryToTabMap: Record<string, TabType> = {
	"settings": "general",
	"favorites": "liked", 
	"account": "account",
	"notifications": "notifications",
	"help": "notifications", // help maps to notifications tab
	"translations": "general", // translations maps to general settings
	"history": "general", // history maps to general settings
};

const SettingsWindow = ({user}: {user: User} ) => {
	const searchParams = useSearchParams();
	
	// Get initial tab from query params or default to "general"
	const getInitialTab = (): TabType => {
		const tabParam = searchParams?.get("tab");
		if (tabParam && queryToTabMap[tabParam]) {
			return queryToTabMap[tabParam];
		}
		return "general";
	};

	const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

	// Settings actions
	const loadSettings = useLoadSettings();

	// Load settings on mount
	useEffect(() => {
		if (user?.id) {
			loadSettings();
		}
	}, [user?.id, loadSettings]);

	// Update active tab when query params change
	useEffect(() => {
		const tabParam = searchParams?.get("tab");
		if (tabParam && queryToTabMap[tabParam]) {
			setActiveTab(queryToTabMap[tabParam]);
		}
	}, [searchParams]);

	const renderTabContent = () => {
		switch (activeTab) {
			case "general":
				return <GeneralTab />;
			case "liked":
				return <LikedTranslationsTab />;
			case "account":
				return <Account user={user} />;
			case "notifications":
				return <NotifivationsTab />;
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col flex-1 h-full w-full">
			{/* Tab Navigation - mobile first responsive */}
			<div className="border-b border-border mb-3 sm:mb-4 md:mb-6">
				<div className="flex gap-2 justify-between sm:gap-4 sm:justify-start md:gap-8 overflow-x-auto scrollbar-hide">
					{tabs.map((tab) => (
						<TabButton
							key={tab.id}
							tab={tab}
							activeTab={activeTab}
							activate={setActiveTab}
						/>
					))}
				</div>
			</div>

			{/* Tab Content - mobile first responsive */}
			<div className="flex-1 overflow-hidden px-1 sm:px-2 md:px-0">
				<div className="h-full overflow-y-auto">
					{renderTabContent()}
				</div>
			</div>
		</div>
	);
};

export default SettingsWindow;
