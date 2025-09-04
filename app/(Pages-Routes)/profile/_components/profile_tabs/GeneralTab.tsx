import React from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/shadcn/ui/select";

import {
	languages,
	toneStyle,
	LanguageShort,
} from "@/shared/config/translation";

import { Save, Loader2, CheckCircle } from "lucide-react";

import {
	useDefaultSourceLang,
	useDefaultTargetLang,
	useTranslationStyle,
	useSettingsLoading,
	useSettingsSaving,
	useLastSaved,
	useSetDefaultSourceLang,
	useSetDefaultTargetLang,
	useSetTranslationStyle,
} from "@/presentation/stores/settingsStore";

interface GeneralTabProps {
	saveSettings: () => void;
}

const GeneralTab = ({ saveSettings }: GeneralTabProps) => {
	const sourceLanguage = useDefaultSourceLang();
	const targetLanguage = useDefaultTargetLang();
	const translationStyle = useTranslationStyle();

	const isLoading = useSettingsLoading();
	const isSaving = useSettingsSaving();
	const lastSaved = useLastSaved();

	const setSourceLanguage = useSetDefaultSourceLang();
	const setTargetLanguage = useSetDefaultTargetLang();
	const setTranslationStyle = useSetTranslationStyle();

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
						value={sourceLanguage || "ru"}
						onValueChange={setSourceLanguage}
					>
						<SelectTrigger className="w-full h-10 text-sm">
							<SelectValue placeholder="Select source language" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(languages).map(
								([code, language]) => (
									<SelectItem key={code} value={code}>
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
							setTargetLanguage(value as LanguageShort)
						}
					>
						<SelectTrigger className="w-full h-10 text-sm">
							<SelectValue placeholder="Select target language" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(languages).map(
								([code, language]) => (
									<SelectItem key={code} value={code}>
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
						value={translationStyle || "neutral"}
						onValueChange={setTranslationStyle}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select translation style" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(toneStyle).map(([key, value]) => {
								const displayNames: Record<string, string> = {
									neutral: "Neutral",
									formal: "Formal",
									poetic: "Poetic",
									informal: "Informal",
								};
								return (
									<SelectItem key={key} value={value}>
										{displayNames[key] || key}
									</SelectItem>
								);
							})}
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
						onClick={saveSettings}
						disabled={isSaving || isLoading}
						className="flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-4"
					>
						{isSaving ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Save className="w-4 h-4" />
						)}
						<span className="hidden xs:inline">
							{isSaving ? "Saving..." : "Save Settings"}
						</span>
						<span className="xs:hidden">
							{isSaving ? "Saving..." : "Save"}
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default GeneralTab;
