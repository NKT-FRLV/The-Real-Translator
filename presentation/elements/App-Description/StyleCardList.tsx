'use client'
import React, { useState } from 'react';
import { toneDescriptions, ToneDescription } from '@/shared/constants/tone-style';
import { Tone } from '@/shared/types/types';
import { StyleCard } from './StyleCard';
import { StyleModal } from './StyleModal';
import { useTone, useSetTone } from '@/presentation/stores/translatorStore';

type StyleCardListProps = {
  items?: ToneDescription[];
//   onToneSelect?: (tone: Tone) => void;
};

export const StyleCardList: React.FC<StyleCardListProps> = ({ 
  items, 
//   onToneSelect 
}) => {
  const list = items ?? toneDescriptions;

  const tone = useTone();
  const setTone = useSetTone();
  const [selectedStyle, setSelectedStyle] = useState<ToneDescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (style: ToneDescription) => {
    setSelectedStyle(style);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedStyle(null);
  };

  const handleToneSelect = (tone: Tone) => {
	setTone(tone);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-2 gap-3 ">
        {list.map((style, index) => (
          <StyleCard 
            key={`${style.tone}-${index}`} 
            style={style}
			isSelected={tone === style.tone}
            onClick={() => handleCardClick(style)}
          />
        ))}
      </div>
      
      <StyleModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        style={selectedStyle}
        onSelectTone={handleToneSelect}
      />
    </>
  );
};


