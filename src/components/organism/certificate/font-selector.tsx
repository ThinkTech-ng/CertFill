import React from "react";
import { certificateFontFamily } from "@/store/certificate";

interface FontSelectorProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({ selectedFont, onFontChange }) => {
  return (
    <select
      id="font-selector"
      value={selectedFont}
      onChange={(e) => onFontChange(e.target.value)}
      className="inputField block w-full flex-1"
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
  );
};

export default FontSelector;