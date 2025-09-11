import { Loader2, Save } from "lucide-react";
import { useFormStatus } from "react-dom";


const SubmitButton = () => {
	const { pending } = useFormStatus();
	
	return (
		<button
			type="submit"
			disabled={pending}
			className="flex items-center justify-center min-w-40 md:min-h-12 space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:px-4"
		>
			{pending ? (
				<Loader2 className="w-4 h-4 animate-spin" />
			) : (
				<Save className="w-4 h-4" />
			)}
			<span className="hidden xs:inline">
				{pending ? "Saving..." : "Save Settings"}
			</span>
			<span className="xs:hidden">
				{pending ? "Saving..." : "Save"}
			</span>
		</button>
	);
};

export default SubmitButton;