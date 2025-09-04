import React from "react";

import {
	useEmailNotifications,
	useTranslationReminders,
	useSetEmailNotifications,
	useSetTranslationReminders,
} from "@/presentation/stores/settingsStore";

const NotifivationsTab = () => {
	const emailNotifications = useEmailNotifications();
	const translationReminders = useTranslationReminders();

	const setEmailNotifications = useSetEmailNotifications();
	const setTranslationReminders = useSetTranslationReminders();

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
								setEmailNotifications(e.target.checked)
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
								setTranslationReminders(e.target.checked)
							}
						/>
						<div className="w-11 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
					</label>
				</div>
			</div>
		</div>
	);
};

export default NotifivationsTab;
