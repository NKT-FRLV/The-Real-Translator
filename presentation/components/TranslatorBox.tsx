'use client';
import React, { useState } from 'react';
import { TextArea } from './TextArea';

export const TranslatorBox: React.FC = () => {
  const [inputText, setInputText] = useState('Hello world');
  const [outputText, setOutputText] = useState('...........');

  const handleInputChange = (text: string) => {
    setInputText(text);
    // Mock translation: convert each character to a dot
    setOutputText(text.replace(/./g, '.'));
  };

  const handleClearInput = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="grid grid-cols-1 gap-4 mb-8 lg:grid-cols-2 w-full bg-gradient-to-t from-red-900/20 to-[90%] from-[#121214] rounded-4xl px-4 pb-8">
      <TextArea
        value={inputText}
        onChange={handleInputChange}
        onClear={handleClearInput}
        placeholder="Enter text to translate..."
        isInput={true}
        maxLength={10000}
      />
      <TextArea
        value={outputText}
        placeholder="Translation will appear here..."
        isInput={false}
        readOnly={true}
      />
    </div>
  );
};