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
      description: 'Academic and sophisticated language'
    },
    {
      name: 'Street Slang',
      description: 'Casual expressions and local slang'
    }
  ];

  return (
    <div className="w-full">
      <div className="p-2 md:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl font-bold text-white mb-4">
                AI-Powered Translator
                <span className="block text-3xl font-semibold text-gray-300 mt-2">
                  for 100+ Languages
                </span>
              </h2>
              <p className="text-gray-300 text-xl font-semibold leading-relaxed">
                Experience translation that goes beyond word-for-word accuracy. 
                Our AI understands context, culture, and nuance to deliver translations 
                that sound natural and authentic—just like a native speaker would say it.
              </p>
            </div>

            {/* Translation Styles */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Choose Your Translation Style:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {translationStyles.map((style, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <h4 className="font-semibold text-white text-sm mb-1">
                      {style.name}
                    </h4>
                    <p className="text-gray-400 text-xs">
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