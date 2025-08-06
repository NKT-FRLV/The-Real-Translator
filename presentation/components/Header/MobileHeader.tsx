"use client";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadcn/ui/avatar';
import ThemeSwitcher from './ThemeSwitcher';
import Logo from './Logo';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuToggle, isMenuOpen }) => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side: Burger menu and logo with title */}
        <div className="flex items-center gap-4">
          {/* Burger menu button */}
          <button
            onClick={onMenuToggle}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col w-5 h-5 justify-center items-center">
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                }`}
              />
            </div>
          </button>

          {/* Logo and title */}
          <div className="flex items-center gap-6">
            <Logo size={32} />
            <h1 className="text-lg font-semibold text-foreground">Real-Translator</h1>
          </div>
        </div>

        {/* Right side: Avatar and Theme-Swith button */}
        <div className="flex items-center">
		<ThemeSwitcher className='mr-4'/>
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>RT</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;