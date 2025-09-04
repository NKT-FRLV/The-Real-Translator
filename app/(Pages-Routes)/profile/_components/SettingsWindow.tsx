"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Settings, Heart, User, Bell } from "lucide-react";
import TabButton from "./TabButton";
import GeneralTab from "./profile_tabs/GeneralTab";
import LikedTranslationsTab from "./profile_tabs/LikedTranslationsTab";
import Account from "./profile_tabs/Account";
import NotifivationsTab from "./profile_tabs/NotifivationsTab";

import {
	useLoadSettings,
	useSaveSettings,
} from "@/presentation/stores/settingsStore";
import { toast } from "sonner";

export type TabType = "general" | "liked" | "account" | "notifications";

export interface Tab {
	id: TabType;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
	{ id: "general", label: "General", icon: Settings },
	{ id: "liked", label: "Liked", icon: Heart },
	{ id: "account", label: "Account", icon: User },
	{ id: "notifications", label: "Alerts", icon: Bell },
];

const SettingsWindow = () => {
	const { data: session } = useSession();
	const [activeTab, setActiveTab] = useState<TabType>("general");
	const user = session?.user;

	// Settings actions
	const loadSettings = useLoadSettings();
	const saveSettings = useSaveSettings();

	// Load settings on mount
	useEffect(() => {
		if (session?.user?.id) {
			loadSettings();
		}
	}, [session?.user?.id, loadSettings]);

	// Handle save settings
	const handleSaveSettings = async () => {
		try {
			await saveSettings();
			toast.success("Settings saved successfully!");
		} catch {
			toast.error("Failed to save settings. Please try again.");
		}
	};

	if (!user) return null;

	const renderTabContent = () => {
		switch (activeTab) {
			case "general":
				return <GeneralTab saveSettings={handleSaveSettings} />;
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
