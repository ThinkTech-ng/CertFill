import React from 'react';
import { certificateFontFamily } from '@/store/certificate';

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, onFontChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-black uppercase">Font Name</label>
      <div className="relative w-full">
        <select
          id="font-selector"
          value={selectedFont}
          onChange={(e) => onFontChange(e.target.value)}
          className="inputField block w-full flex-1 appearance-none"
        >
          <option value="" disabled>
            Choose a font
          </option>
          {certificateFontFamily.map(({ class: fontClass, name }) => (
            <option key={fontClass} value={fontClass}>
              {name}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-[#888585]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default FontSelector;
