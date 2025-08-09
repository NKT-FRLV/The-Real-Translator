import React from 'react';
import { toneDescriptions, ToneDescription } from '@/shared/constants/tone-style';
import { StyleCard } from './StyleCard';

type StyleCardListProps = {
  items?: ToneDescription[];
};

export const StyleCardList: React.FC<StyleCardListProps> = ({ items }) => {
  const list = items ?? toneDescriptions;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-2 gap-3 ">
      {list.map((style, index) => (
        <StyleCard key={`${style.tone}-${index}`} style={style} />
      ))}
    </div>
  );
};


