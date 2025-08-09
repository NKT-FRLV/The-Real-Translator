import React from 'react';
import { ToneDescription } from '@/shared/constants/tone-style';

type StyleCardProps = {
  style: ToneDescription;
};

export const StyleCard: React.FC<StyleCardProps> = ({ style }) => {
  return (
    <div
      className={[
        'relative flex flex-col rounded-lg p-4 border transition-colors',
        style.new
          ? 'bg-gradient-to-br from-primary/10 via-accent/30 to-transparent border-primary/60 ring-1 ring-primary/30 shadow-md shadow-primary/10'
          : 'bg-accent/50 border-border hover:border-gray-500',
      ].join(' ')}
    >
      {style.new && (
        <span className="absolute -top-2 -right-2 select-none rounded-md bg-gradient-to-r from-primary to-chart-5 text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-1 shadow-sm">
          NEW
        </span>
      )}
      <h4
        className='text-base md:text-lg font-semibold text-foreground mb-1'
      >
        {style.name}
      </h4>
      <p
        className='text-sm md:text-[15px] text-muted-foreground flex-1 flex items-center'
      >
        {style.description}
      </p>
    </div>
  );
};


