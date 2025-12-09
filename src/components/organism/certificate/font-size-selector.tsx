import React from 'react';

interface FontSizeSelectorProps {
  selectedFontSize: number;
  onFontSizeChange: (size: number) => void;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  selectedFontSize,
  onFontSizeChange,
}) => {
  return (
    <input
      type="number"
      value={selectedFontSize}
      onChange={(e) => onFontSizeChange(Number(e.target.value))}
      className="w-full outline-none border border-[#888585] rounded-xl focus:border-[#00a2b9] h-8 text-[11px] px-2 py-1 text-black font-medium bg-white"
    />
  );
};

export default FontSizeSelector;
