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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Font Size</label>
      <input
        type="number"
        value={selectedFontSize}
        onChange={(e) => onFontSizeChange(Number(e.target.value))}
        className="inputField max-w-[75px] w-[50px]"
      />
    </div>
  );
};

export default FontSizeSelector;
