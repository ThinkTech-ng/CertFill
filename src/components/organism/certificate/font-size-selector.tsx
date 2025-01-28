import React from "react";
import { certificateFontSize } from "@/store/certificate";

interface FontSizeSelectorProps {
  selectedFontSize: number;
  onFontSizeChange: (size: number) => void;
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ selectedFontSize, onFontSizeChange }) => {
  return (
    <select
      id="font-size-selector"
      value={selectedFontSize}
      onChange={(e) => onFontSizeChange(Number(e.target.value))}
      className="inputField max-w-[75px] w-[50px]"
    >
      {certificateFontSize.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  );
};

export default FontSizeSelector;