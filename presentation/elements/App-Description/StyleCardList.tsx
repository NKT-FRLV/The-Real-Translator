'use client'
import React, { useState } from 'react';
import { toneDescriptionsMap, toneDescriptions, ToneDescription } from '@/shared/constants/tone-style';
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

  const [selectedTone, setSelectedTone] = useState<Tone>(tone);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleModalOpen = (tone: Tone) => {
	setIsModalOpen(true);	
	setSelectedTone(tone);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-2 gap-3 ">
        {list.map((style, index) => (
          <StyleCard 
            key={`${style.tone}-${index}`} 
            style={style}
			isSelected={tone === style.tone}
            onClick={() => handleModalOpen(style.tone)}
          />
        ))}
      </div>
      
      <StyleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        style={toneDescriptionsMap[selectedTone]}
        onSelectTone={setTone}
      />
    </>
  );
};


