// import React from "react";
import { languages } from "@/shared/constants/languages";
import { LanguageShort } from "@/shared/types/types";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/shadcn/ui/select";

interface LanguageSelectProps {
	disabledValue: LanguageShort;
	value: LanguageShort;
	setValue: (value: LanguageShort) => void;
}

const LanguageSelect = ({ disabledValue, value, setValue }: LanguageSelectProps) => {
	return (
		<Select value={value} onValueChange={setValue}>
			<SelectTrigger size="max" className="flex justify-center w-full text-gray-300 font-semibold text-xl bg-transparent border-none focus:ring-0 hover:bg-gray-700" icon={false} disabled={disabledValue === value}>
				<SelectValue placeholder="Select a language" />
			</SelectTrigger>
			<SelectContent>
				{Object.values(languages).map((language) => (
					<SelectItem key={language.code} value={language.code} disabled={disabledValue === language.code} className="font-medium text-lg">
						{language.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default LanguageSelect;
