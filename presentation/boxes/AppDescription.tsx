'use client';

import React from 'react';
import { StyleCardList } from '@/presentation/elements/App-Description/StyleCardList';
import { Illustration } from '@/presentation/elements/App-Description/Illustration';

export const AppDescription: React.FC = () => {


  return (
    <div className="w-full">
      <div className="py-0 px-2 md:px-4 ">
        <div className="grid grid-cols-1 md:grid-rows-2 lg:grid-cols-2 gap-4 items-center md:items-start">
          {/* Left Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-4 text-center md:text-left">
                AI-Powered Translator
                <span className="block text-3xl font-semibold text-foreground my-6 md:my-2">
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
              <h3 className="text-2xl font-semibold text-foreground m-0">
                Choose Your Translation Style:
              </h3>
              
            </div>
          </div>
		  
          {/* Right Content - Illustration */}
          <Illustration />
		  <StyleCardList />
        </div>
      </div>
    </div>
  );
}; 