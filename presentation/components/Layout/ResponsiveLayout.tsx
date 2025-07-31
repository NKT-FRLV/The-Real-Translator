"use client";
import React, { useState } from 'react';
import SideMenu from '../Side-Menu/SideMenu';
import MobileHeader from '../Header/MobileHeader';
import BurgerMenu from '../Navigation/BurgerMenu';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader 
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Burger Menu */}
      <BurgerMenu 
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
      />

      {/* Main Content Area */}
      <div className="w-full h-full flex justify-start gap-4 pt-16 md:pt-0">
        {/* Desktop Side Menu - only visible on desktop */}
        <SideMenu />
        
        {/* Content */}
        <div className="m-0 px-0 md:ml-30 flex flex-col gap-4 w-full h-full items-center justify-start md:justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveLayout;