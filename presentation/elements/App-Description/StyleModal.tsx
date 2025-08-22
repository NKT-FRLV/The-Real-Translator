import React from 'react';
import { ToneDescription } from '@/shared/constants/tone-style';
import { Tone } from '@/shared/types/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/shadcn/ui/dialog';
import Image from 'next/image';
import { Button } from '@/shared/shadcn/ui/button';

interface StyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  style: ToneDescription | null;
  onSelectTone: (tone: Tone) => void;
}

export const StyleModal: React.FC<StyleModalProps> = ({
  isOpen,
  onClose,
  style,
  onSelectTone,
}) => {

  
  if (!style) return null;

  const handleSelectTone = () => {
    // Устанавливаем выбранный тон в глобальном сторе
    onSelectTone(style.tone);
    onClose();
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] max-w-[95vw] md:min-w-[800px] md:min-h-[650px] overflow-y-auto" showCloseButton>
		{style.image && <Image src={`/${style.image}`} alt={style.name} fill className="opacity-20" />}
        <div className="relative z-1 flex flex-col justify-between">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl md:text-4xl font-bold text-foreground">
                {style.name}
              </DialogTitle>
              {style.new && (
                <span className="rounded-md bg-gradient-to-r from-primary to-chart-5 text-primary-foreground text-xs font-bold px-2 py-1 shadow-sm md:text-xl md:px-4 md:py-2">
                  NEW
                </span>
              )}
            </div>
            <p className="text-md md:text-2xl text-muted-foreground font-medium">
              {style.description}
            </p>
          </DialogHeader>

          <div className="py-6">
            <div className="space-y-4">
              <h3 className="text-md md:text-2xl font-semibold text-foreground">
                About this style
              </h3>
              <p className="text-md md:text-2xl text-muted-foreground leading-relaxed">
                {style.detailedDescription}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={handleSelectTone}
			  variant="outline"
              className="flex-1 sm:flex-none md:text-2xl md:px-8 md:py-6"
            >
              Use this style
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
