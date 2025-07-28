import { useState, useEffect } from 'react';

interface ScreenSize {
  width: number;
  height: number;
}

interface LogoSizeConfig {
  size: number;
  breakpoint: number;
}

const LOGO_SIZES: LogoSizeConfig[] = [
  { size: 40, breakpoint: 0 },    // mobile
  { size: 60, breakpoint: 640 },  // sm
  { size: 70, breakpoint: 768 },  // md  
  { size: 80, breakpoint: 1024 }, // lg
];

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Вызываем сразу для получения актуального размера
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export const useLogoSize = (): number => {
  const { width } = useScreenSize();
  
  // Находим подходящий размер логотипа
  const logoConfig = LOGO_SIZES
    .slice()
    .reverse()
    .find(config => width >= config.breakpoint);
    
  return logoConfig?.size || 40;
}; 