"use client";

import { ArrowLeftRight } from "lucide-react";
import LanguageSelect from "./LanguageSelect";
import { Button } from "@/shared/shadcn/ui/button";
import { LanguageShort } from "@/shared/types/types";
import { useState } from "react";

const LanguageSelector: React.FC = () => {
	const [writingLanguage, setWritingLanguage] = useState<LanguageShort>("ru");
	const [readingLanguage, setReadingLanguage] = useState<LanguageShort>("en");

	const handleSwapLanguages = () => {
		const temp = writingLanguage;
		setWritingLanguage(readingLanguage);
		setReadingLanguage(temp);
	};

	return (
		<div className="px-4 w-full">
			<div className="flex h-30 items-center justify-start border-b border-gray-700 bg-[#252427] p-6 rounded-lg">
				<div className="flex w-full h-full items-center gap-4">
					<LanguageSelect
						value={writingLanguage}
						setValue={setWritingLanguage}
						disabledValue={readingLanguage}
					/>
					<Button
						variant="ghost"
						size="icon"
						className="h-full min-w-[80px] hover:bg-gray-700"
						onClick={handleSwapLanguages}
					>
						<ArrowLeftRight
							height={40}
							width={20}
							className="text-gray-400 stroke-2 size-6"
						/>
					</Button>
					<LanguageSelect
						value={readingLanguage}
						setValue={setReadingLanguage}
						disabledValue={writingLanguage}
					/>
				</div>
			</div>
		</div>
	);
};

export default LanguageSelector;
