'use client';
import React from 'react';
import { X, Volume2, Mic, Copy, Bookmark, Share, ThumbsUp, ThumbsDown } from 'lucide-react';

interface TextAreaProps {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isInput?: boolean;
  readOnly?: boolean;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value = '',
  onChange,
  onClear,
  placeholder,
  isInput = false,
  readOnly = false,
  maxLength = 10000
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-700 bg-[#252427]">
      <div className="p-4 min-h-[200px]">
        <textarea
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full h-32 bg-transparent text-white placeholder-gray-500 border-none outline-none resize-none text-lg"
          maxLength={maxLength}
        />
      </div>
      
      <div className="border-t border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <Volume2 className="w-4 h-4 text-gray-400" />
          </button>
          
          {isInput && (
            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
            <Copy className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          {isInput ? (
            <>
              <span className="text-sm text-gray-500">
                {value.length}/{maxLength}
              </span>
              {value.length > 0 && (
                <button 
                  onClick={onClear}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </>
          ) : (
            <>
              <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                <Bookmark className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                <Share className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                <ThumbsUp className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                <ThumbsDown className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};