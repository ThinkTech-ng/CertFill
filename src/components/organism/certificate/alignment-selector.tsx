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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Name Placement</label>
      <div className="relative w-full">
        <select
          id="font-selector"
          value={selectedAlignment}
          onChange={(e) => onAlignmentChange(e.target.value)}
          className="inputField block w-full flex-1 pr-10 pl-4 py-2 appearance-none text-[#888585] border border-[#888585] rounded"
        >
          <option value="" disabled>
            Choose name print alignment
          </option>
          {certificateAlignment.map((alignment) => (
            <option key={alignment} value={alignment}>
              {alignment}
            </option>
          ))}
        </select>

        {/* Down Arrow */}
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

export default AlignmentSelector;
