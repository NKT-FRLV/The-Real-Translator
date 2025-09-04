import React from 'react';
import { ToneDescription } from '@/shared/constants/tone-style';
import { CheckIcon } from 'lucide-react';

type StyleCardProps = {
  style: ToneDescription;
  isSelected: boolean;
  onClick?: () => void;
};

export const StyleCard: React.FC<StyleCardProps> = ({ style, isSelected, onClick }) => {
  return (
    <div
      className={[
        'relative flex flex-col rounded-lg px-4 py-2 border cursor-pointer transition-all duration-200 ease-in-out',
        style.new
          ? 'bg-gradient-to-br from-primary/10 via-accent/30 to-transparent border-primary/60 ring-1 ring-primary/30 shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20'
          : 'bg-accent/50 border-border hover:border-gray-500 hover:bg-accent/70',
      ].join(' ')}
      onClick={onClick}
    >
      {style.new && (
        <span className="absolute -top-2 -right-2 font-orbitron select-none rounded-md bg-gradient-to-r from-primary to-chart-5 text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-1 shadow-sm">
          NEW
        </span>
      )}
      {isSelected && (
        <div className="absolute top-2 right-4 flex items-center gap-2 select-none text-success md:text-md font-bold">
          Active <div className="w-4 h-4 bg-success rounded-full"><CheckIcon className="w-4 h-4" /></div>
        </div>
      )}
      <h4
        className='font-orbitron tracking-widest text-sm md:text-md font-semibold text-foreground mb-1'
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


