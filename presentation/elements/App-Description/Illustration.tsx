import React from 'react';
import Image from 'next/image';

type IllustrationProps = {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export const Illustration: React.FC<IllustrationProps> = ({
  src = '/popularTranslations.png',
  alt = 'AI Translation Illustration',
  width = 300,
  height = 250,
  className = 'w-full max-w-md',
  priority = true,
}) => {
  return (
    <div className="flex justify-center items-center pt-4">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
      />
    </div>
  );
};


