'use client';
import React from 'react';
import Image from 'next/image';

export const AppDescription: React.FC = () => {
  const translationStyles = [
    {
      name: 'Natural',
      description: 'Standard, professional translation'
    },
    {
      name: 'Intelligent',
      description: 'Academic or formal talk tone'
    },
    {
      name: 'Street Slang',
      description: 'Casual expressions and local slang, informal talk tone'
    }
  ];

  return (
    <div className="w-full">
      <div className="p-2 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-4">
                AI-Powered Translator
                <span className="block text-3xl font-semibold text-foreground mt-2">
                  for 100+ Languages
                </span>
              </h2>
              <p className="text-foreground text-xl font-semibold leading-relaxed">
                Experience translation that goes beyond word-for-word accuracy. 
                Our AI understands context, culture, and nuance to deliver translations 
                that sound natural and authentic—just like a native speaker would say it.
              </p>
            </div>

            {/* Translation Styles */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Choose Your Translation Style:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {translationStyles.map((style, index) => (
                  <div 
                    key={index}
                    className="bg-accent/50 rounded-lg p-4 border border-border hover:border-gray-500 transition-colors"
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {style.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {style.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - С локальным изображением */}
          <div className="flex justify-center items-center pt-4">
            <Image 
              src="/popularTranslations.png"  // файл из папки public/
              alt="AI Translation Illustration"
			  priority
              width={300}
              height={250}
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 