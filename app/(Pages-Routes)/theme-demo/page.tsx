'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ThemeToggleButton, useThemeTransition } from '@/shared/shadcn/ui/theme-toggle-button';

const ThemeToggleVariantsDemo = () => {
  const { theme, setTheme } = useTheme();
  const { startTransition } = useThemeTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    startTransition(() => {
      setTheme(newTheme);
    });
  }, [theme, setTheme, startTransition]);

  const currentTheme = theme === 'system' ? 'light' : (theme as 'light' | 'dark') || 'light';

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Theme Toggle Demo</h1>
          <p className="text-muted-foreground text-lg">
            Попробуйте различные анимации переключения темы
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Текущая тема: <span className="font-medium">{currentTheme}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {/* Circle animation */}
          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="circle"
              start="center"
            />
            <div className="text-center">
              <span className="text-sm font-medium">Circle</span>
              <p className="text-xs text-muted-foreground">Expanding circle</p>
            </div>
          </div>

          {/* Circle blur animation */}
          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="circle-blur"
              start="top-right"
            />
            <div className="text-center">
              <span className="text-sm font-medium">Circle Blur</span>
              <p className="text-xs text-muted-foreground">Soft-edge circle</p>
            </div>
          </div>

          {/* Polygon animation */}
          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="polygon"
            />
            <div className="text-center">
              <span className="text-sm font-medium">Polygon</span>
              <p className="text-xs text-muted-foreground">Diagonal wipe</p>
            </div>
          </div>

          {/* GIF animation с локальными гифками */}
          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="gif"
              url="/giphy-robot-1.gif"
            />
            <div className="text-center">
              <span className="text-sm font-medium">GIF Mask 1</span>
              <p className="text-xs text-muted-foreground">Robot animation</p>
            </div>
          </div>

          {/* Дополнительные варианты с разными позициями */}
          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="circle"
              start="top-left"
            />
            <div className="text-center">
              <span className="text-sm font-medium">Top Left</span>
              <p className="text-xs text-muted-foreground">Corner expansion</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="circle-blur"
              start="bottom-right"
            />
            <div className="text-center">
              <span className="text-sm font-medium">Bottom Right</span>
              <p className="text-xs text-muted-foreground">Corner blur</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="gif"
              url="/giphy-robot-2.gif"
            />
            <div className="text-center">
              <span className="text-sm font-medium">GIF Mask 2</span>
              <p className="text-xs text-muted-foreground">Robot animation 2</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 p-6 border rounded-lg">
            <ThemeToggleButton 
              theme={currentTheme}
              onClick={handleThemeToggle}
              variant="circle"
              start="bottom-left"
              showLabel
            />
            <div className="text-center">
              <span className="text-sm font-medium">With Label</span>
              <p className="text-xs text-muted-foreground">Shows text</p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">
            Все анимации используют View Transitions API для плавных переходов между темами
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            В браузерах без поддержки API переходы происходят мгновенно
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggleVariantsDemo;
