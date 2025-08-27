"use client";
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	NavigationMenu,
	NavigationMenuList,
} from "@/shared/shadcn/ui/navigation-menu";
import NavIcon from "../NavIcon";

interface BurgerMenuProps {
	isOpen: boolean;
	onClose: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
	//   if (!isOpen) return null;

	return (
		<>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="md:hidden fixed inset-0 top-16 flex flex-col z-50"
						key="burger-menu"
						initial={{ opacity: 0, y: -100 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -100 }}
						transition={{ duration: 0.2 }}
					>
						{/* Menu */}
						<div className="bg-background border-b border-gray-700 shadow-lg z-51">
							<div className="p-4">
								<NavigationMenu className="w-full">
									<NavigationMenuList className="flex-col w-full space-y-2">
										{/* Translation Tools */}
										<NavIcon
											iconType="languages"
											variant="mobile"
											label="Translation Tools"
											size={24}
											menuItems={[
												{ label: "Documents" },
												{ label: "Web Pages" },
												{ label: "Text" },
											]}
										/>

										{/* History */}
										<NavIcon
											iconType="clock"
											variant="mobile"
											label="History"
											size={24}
											menuItems={[
												{ label: "Recent Translations" },
												{ label: "Today" },
												{ label: "This Week" },
											]}
										/>

										{/* Favorites */}
										<NavIcon
											iconType="heart"
											variant="mobile"
											label="Favorites"
											size={24}
											menuItems={[
												{ label: "Saved Translations" },
												{ label: "Collections" },
												{ label: "Export" },
											]}
										/>

										{/* Settings */}
										<NavIcon
											iconType="settings"
											variant="mobile"
											label="Settings"
											size={24}
											menuItems={[
												{ label: "Languages" },
												{ label: "Themes" },
												{ label: "Notifications" },
											]}
										/>

										{/* Help */}
										<NavIcon
											iconType="help"
											variant="mobile"
											label="Help"
											size={24}
											menuItems={[
												{ label: "FAQ" },
												{ label: "Shortcuts" },
												{ label: "Feedback" },
											]}
										/>
									</NavigationMenuList>
								</NavigationMenu>
							</div>
						</div>
						{/* Backdrop */}
						<div
							className="md:hidden h-full w-full bg-background/50"
							onClick={onClose}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default BurgerMenu;
