"use client";
import React from 'react';
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink 
} from '@/shared/shadcn/ui/navigation-menu';

interface BurgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-50 bg-background border-b border-gray-700 shadow-lg">
        <div className="p-4">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex-col w-full space-y-2">
              
              {/* Translation Tools */}
              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="w-full justify-start gap-3 p-4 h-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>Translation Tools</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full p-2">
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Documents
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Web Pages
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Text
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* History */}
              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="w-full justify-start gap-3 p-4 h-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>History</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full p-2">
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Recent Translations
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Today
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      This Week
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Favorites */}
              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="w-full justify-start gap-3 p-4 h-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Favorites</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full p-2">
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Saved Translations
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Collections
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Export
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Settings */}
              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="w-full justify-start gap-3 p-4 h-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full p-2">
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Languages
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Themes
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Notifications
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Help */}
              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="w-full justify-start gap-3 p-4 h-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Help</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-full p-2">
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      FAQ
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Shortcuts
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block p-3 text-sm hover:bg-gray-800 rounded">
                      Feedback
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;