import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/ui/avatar'
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink 
} from '@/shared/shadcn/ui/navigation-menu'
import Logo from '../Logo'

const SideMenu = () => {
  return (
	<header className="hidden md:flex fixed top-0 bottom-0 flex flex-col items-center justify-between py-8 pr-8 border-r border-gray-700">
		{/* Логотип сверху */}
		<div className="flex items-center gap-2">
			<Logo responsive/>
		</div>

		{/* Навигационные иконки в центре */}
		<div className="flex-1 flex items-center justify-center">
			<NavigationMenu viewport={false} className="flex-col">
				<NavigationMenuList className="flex-col gap-4">
					{/* Иконка перевода с будущим дропдауном */}
					<NavigationMenuItem>
						<NavigationMenuTrigger chevron={false} className="w-12 h-12 p-0 rounded-lg">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
							</svg>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-48 p-2">
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Documents
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Web Pages
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Text
								</NavigationMenuLink>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					{/* Иконка истории */}
					<NavigationMenuItem>
						<NavigationMenuTrigger chevron={false} className="flex items-center justify-center w-12 h-12 p-0 rounded-lg">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-48 p-2">
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Recent Translations
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Today
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									This Week
								</NavigationMenuLink>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					{/* Иконка избранного */}
					<NavigationMenuItem>
						<NavigationMenuTrigger chevron={false} className="flex items-center justify-center w-12 h-12 p-0 rounded-lg">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-48 p-2">
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Saved Translations
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Collections
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Export
								</NavigationMenuLink>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					{/* Иконка настроек */}
					<NavigationMenuItem>
						<NavigationMenuTrigger chevron={false} className="flex items-center justify-center w-12 h-12 p-0 rounded-lg">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-48 p-2">
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Languages
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Themes
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Notifications
								</NavigationMenuLink>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>

					{/* Иконка помощи */}
					<NavigationMenuItem>
						<NavigationMenuTrigger chevron={false} className="flex items-center justify-center w-12 h-12 p-0 rounded-lg">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-48 p-2">
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									FAQ
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Shortcuts
								</NavigationMenuLink>
								<NavigationMenuLink className="block p-2 text-sm hover:bg-gray-100">
									Feedback
								</NavigationMenuLink>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>

		{/* Аватарка снизу */}
		<div className="flex items-center gap-2">
			<Avatar className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16">
				<AvatarImage src="https://github.com/shadcn.png" />
			</Avatar>
		</div>
	</header>
  )
}

export default SideMenu