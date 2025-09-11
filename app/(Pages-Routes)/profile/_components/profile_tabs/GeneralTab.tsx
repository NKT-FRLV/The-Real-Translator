import { toast } from "sonner";
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
	Tone,
} from "@/shared/config/translation";
import { saveSettingsAction } from "@/app/actions/settings";
import SubmitButton from "../SubmitButton";

import {
	useSavedFromLang,
	useSavedToLang,
	useSavedTone,
	useSettingsLoading,
	useSetSavedFromLang,
	useSetSavedToLang,
	useSetSavedTone,
	useSetFromLang,
	useSetToLang,
	useSetTone,
} from "@/presentation/stores/settingsStore";

// Submit button component that uses useFormStatus


const GeneralTab = () => {
	// Используем статические настройки для отображения в форме
	const savedFromLang = useSavedFromLang();
	const savedToLang = useSavedToLang();
	const savedTone = useSavedTone();
	
	const isLoading = useSettingsLoading();
	
	// Actions для обновления динамических и статических настроек после сохранения
	const setSavedFromLang = useSetSavedFromLang();
	const setSavedToLang = useSetSavedToLang();
	const setSavedTone = useSetSavedTone();
	const setFromLang = useSetFromLang();
	const setToLang = useSetToLang();
	const setTone = useSetTone();

	const handleFormAction = async (formData: FormData) => {
		const result = await saveSettingsAction(formData);
		
		if (result.success) {
			// Обновляем статические настройки в store после успешного сохранения
			const newFromLang = formData.get("defaultSourceLang");
			const newToLang = formData.get("defaultTargetLang");
			const newTone = formData.get("translationStyle");
			
			// Type guards
			if (typeof newFromLang === "string" && typeof newToLang === "string" && typeof newTone === "string") {
				setSavedFromLang(newFromLang as LanguageShort);
				setSavedToLang(newToLang as LanguageShort);
				setSavedTone(newTone as Tone);
				
				// Также обновляем динамические настройки
				setFromLang(newFromLang as LanguageShort);
				setToLang(newToLang as LanguageShort);
				setTone(newTone as Tone);
			}
			
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col h-full space-y-4 sm:space-y-6">
				<h2 className="text-lg font-bold sm:text-xl md:text-2xl">
					General Settings
				</h2>
				<div className="flex-1 flex items-center justify-center">
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary sm:h-8 sm:w-8" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col space-y-4 sm:space-y-6">
			<h2 className="text-lg font-bold sm:text-xl md:text-2xl">
				General Settings
			</h2>
			<form action={handleFormAction} className="space-y-4 sm:space-y-6 px-1">
				{/* Source Language */}
				<div className="space-y-2">
					<label className="block text-xs font-medium text-foreground sm:text-sm">
						Default Source Language
					</label>
					<Select name="defaultSourceLang" defaultValue={savedFromLang || "ru"}>
						<SelectTrigger className="w-full h-10 text-sm">
							<SelectValue placeholder="Select source language" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(languages).map(
								([code, language]) => (
									<SelectItem key={code} value={code} disabled={savedToLang === code}>
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
					<Select name="defaultTargetLang" defaultValue={savedToLang || "en"}>
						<SelectTrigger className="w-full h-10 text-sm">
							<SelectValue placeholder="Select target language" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(languages).map(
								([code, language]) => (
									<SelectItem key={code} value={code} disabled={savedFromLang === code}>
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
					<Select name="translationStyle" defaultValue={savedTone || "neutral"}>
						<SelectTrigger className="w-full capitalize">
							<SelectValue placeholder="Select translation style" />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(toneStyle).map(([key, value]) => {
								return (
									<SelectItem key={key} value={value} className="capitalize">
										{value || key}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				{/* Save Settings Button - mobile first responsive */}
				<div className="flex flex-col space-y-3 pt-4 border-t border-border sm:flex-row sm:items-center sm:justify-end sm:space-y-0 sm:pt-6">
					<SubmitButton />
				</div>
			</form>
		</div>
	);
};

export default GeneralTab;
