import React from 'react';
import Image from 'next/image';

type IllustrationProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  lazyLoading?: boolean;
};

export const Illustration: React.FC<IllustrationProps> = ({
  src = '/popularTranslations.png',
  alt = 'AI Translation Illustration',
  className = 'w-full max-w-md m-auto',
  priority = true,

}) => {
  return (
    <div className="relative flex pt-4 h-full min-h-[180px]">
      <Image
        src={src}
        alt={alt}
        fill
		
        className={className}
        priority={priority}
      />
    </div>
  );
};


