"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import {
	Settings,
	Heart,
	User,
	Bell,
	Save,
	Loader2,
	CheckCircle,
} from "lucide-react";
import LikedTranslations from "./LikedTranslations";
import Account from "./profile_tabs/Account";
import {
	languages,
	toneStyle,
	LanguageShort,
	Tone,
} from "@/shared/config/translation";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/shadcn/ui/select";
import {
	useDefaultSourceLang,
	useDefaultTargetLang,
	useTranslationStyle,
	useEmailNotifications,
	useTranslationReminders,
	useSettingsLoading,
	useSettingsSaving,
	useLastSaved,
	useLoadSettings,
	useSaveSettings,
	useSetDefaultSourceLang,
	useSetDefaultTargetLang,
	useSetTranslationStyle,
	useSetEmailNotifications,
	useSetTranslationReminders,
} from "@/presentation/stores/settingsStore";
import { toast } from "sonner";

type TabType = "general" | "liked" | "account" | "notifications";

interface Tab {
	id: TabType;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
	{ id: "general", label: "General", icon: Settings },
	{ id: "liked", label: "Liked Translations", icon: Heart },
	{ id: "account", label: "Account", icon: User },
	{ id: "notifications", label: "Notifications", icon: Bell },
];

const SettingsWindow = () => {
	const { data: session } = useSession();
	const [activeTab, setActiveTab] = useState<TabType>("general");
	const user = session?.user;

	// Settings store hooks
	const sourceLanguage = useDefaultSourceLang();
	const targetLanguage = useDefaultTargetLang();
	const translationStyle = useTranslationStyle();
	const emailNotifications = useEmailNotifications();
	const translationReminders = useTranslationReminders();
	const isLoading = useSettingsLoading();
	const isSaving = useSettingsSaving();
	const lastSaved = useLastSaved();

	// Settings actions
	const loadSettings = useLoadSettings();
	const saveSettings = useSaveSettings();
	const setSourceLanguage = useSetDefaultSourceLang();
	const setTargetLanguage = useSetDefaultTargetLang();
	const setTranslationStyle = useSetTranslationStyle();
	const setEmailNotifications = useSetEmailNotifications();
	const setTranslationReminders = useSetTranslationReminders();

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
				return (
					<div className="flex flex-col space-y-4 sm:space-y-6">
						<h2 className="text-lg font-bold sm:text-xl md:text-2xl">
							General Settings
						</h2>
						<div className="space-y-4 sm:space-y-6">
							{/* Source Language */}
							<div className="space-y-2">
								<label className="block text-xs font-medium text-foreground sm:text-sm">
									Default Source Language
								</label>
								<Select
									value={sourceLanguage || "auto"}
									onValueChange={setSourceLanguage}
								>
									<SelectTrigger className="w-full h-10 text-sm">
										<SelectValue placeholder="Select source language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="auto">
											Auto-detect
										</SelectItem>
										{Object.entries(languages).map(
											([code, language]) => (
												<SelectItem
													key={code}
													value={code}
												>
													{language.label}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>

							{/* Target Language */}
							<div className="space-y-2">
								<label className="block text-xs font-medium text-foreground sm:text-sm">
									Default Target Language
								</label>
								<Select
									value={targetLanguage || "en"}
									onValueChange={(value) =>
										setTargetLanguage(
											value as LanguageShort
										)
									}
								>
									<SelectTrigger className="w-full h-10 text-sm">
										<SelectValue placeholder="Select target language" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(languages).map(
											([code, language]) => (
												<SelectItem
													key={code}
													value={code}
												>
													{language.label}
												</SelectItem>
											)
										)}
									</SelectContent>
								</Select>
							</div>

							{/* Translation Style */}
							<div className="space-y-2">
								<label className="block text-xs font-medium text-foreground sm:text-sm">
									Preferred Translation Style
								</label>
								<Select
									value={translationStyle || "natural"}
									onValueChange={(value) =>
										setTranslationStyle(value as Tone)
									}
								>
									<SelectTrigger className="w-full h-10 text-sm">
										<SelectValue placeholder="Select translation style" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(toneStyle).map(
											([key, value]) => {
												const displayNames: Record<
													string,
													string
												> = {
													natural: "Natural",
													intellectual:
														"Intellectual",
													poetic: "Poetic",
													street: "Street Slang",
												};
												return (
													<SelectItem
														key={key}
														value={value}
													>
														{displayNames[key] ||
															key}
													</SelectItem>
												);
											}
										)}
									</SelectContent>
								</Select>
							</div>

							{/* Save Settings Button - mobile first responsive */}
							<div className="flex flex-col space-y-3 pt-4 border-t border-border sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:pt-6">
								<div className="flex items-center space-x-2 text-xs text-muted-foreground sm:text-sm">
									{lastSaved && (
										<>
											<CheckCircle className="w-3 h-3 text-green-500 sm:w-4 sm:h-4" />
											<span className="truncate">
												<span className="hidden sm:inline">
													Last saved:{" "}
												</span>
												{lastSaved.toLocaleTimeString()}
											</span>
										</>
									)}
								</div>
								<button
									onClick={handleSaveSettings}
									disabled={isSaving || isLoading}
									className="flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-4"
								>
									{isSaving ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Save className="w-4 h-4" />
									)}
									<span className="hidden xs:inline">
										{isSaving
											? "Saving..."
											: "Save Settings"}
									</span>
									<span className="xs:hidden">
										{isSaving ? "Saving..." : "Save"}
									</span>
								</button>
							</div>
						</div>
					</div>
				);
			case "liked":
				return <LikedTranslations />;
			case "account":
				return <Account user={user} />;
			case "notifications":
				return (
					<div className="flex flex-col space-y-4 sm:space-y-6">
						<h2 className="text-lg font-bold sm:text-xl md:text-2xl">
							Notification Settings
						</h2>
						<div className="space-y-4 sm:space-y-6">
							<div className="flex flex-col space-y-3 p-3 bg-card rounded-lg border border-border sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-4">
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-foreground text-sm sm:text-base">
										Email Notifications
									</h3>
									<p className="text-xs text-muted-foreground sm:text-sm">
										Receive updates via email
									</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
									<input
										type="checkbox"
										className="sr-only peer"
										checked={emailNotifications}
										onChange={(e) =>
											setEmailNotifications(
												e.target.checked
											)
										}
									/>
									<div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
								</label>
							</div>
							<div className="flex flex-col space-y-3 p-3 bg-card rounded-lg border border-border sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-4">
								<div className="flex-1 min-w-0">
									<h3 className="font-medium text-foreground text-sm sm:text-base">
										Translation Reminders
									</h3>
									<p className="text-xs text-muted-foreground sm:text-sm">
										Daily translation practice reminders
									</p>
								</div>
								<label className="relative inline-flex items-center cursor-pointer self-end sm:self-auto">
									<input
										type="checkbox"
										className="sr-only peer"
										checked={translationReminders}
										onChange={(e) =>
											setTranslationReminders(
												e.target.checked
											)
										}
									/>
									<div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
								</label>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="flex flex-col flex-1 h-full w-full">
			{/* Tab Navigation - mobile first responsive */}
			<div className="border-b border-border mb-3 sm:mb-4 md:mb-6">
				<div className="flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
					{tabs.map((tab) => {
						const IconComponent = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
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
								<span className="text-xs font-medium xs:hidden">
									{tab.id === "general"
										? "Settings"
										: tab.id === "liked"
										? "Liked"
										: tab.id === "account"
										? "Account"
										: tab.id === "notifications"
										? "Alerts"
										: tab.label}
								</span>
							</button>
						);
					})}
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
