import React from 'react';
import { certificateAlignment } from '@/store/certificate';

interface AlignmentSelectorProps {
  selectedAlignment: string;
  onAlignmentChange: (alignment: string) => void;
}

const AlignmentSelector: React.FC<AlignmentSelectorProps> = ({
  selectedAlignment,
  onAlignmentChange,
}) => {
  return (
    <div className="relative w-full">
      <select
        id="alignment-selector"
        value={selectedAlignment || 'Center'}
        onChange={(e) => onAlignmentChange(e.target.value)}
        className="w-full outline-none border border-[#888585] rounded-xl focus:border-[#00a2b9] appearance-none h-8 text-[11px] pl-2 pr-6 py-1 text-black font-medium bg-white"
      >
        {certificateAlignment.map((alignment) => (
          <option key={alignment} value={alignment}>
            {alignment}
          </option>
        ))}
      </select>

      {/* Down Arrow */}
      <span className="absolute inset-y-0 right-1.5 flex items-center pointer-events-none">
        <svg
          className="w-3 h-3 text-[#888585]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
};

export default AlignmentSelector;
