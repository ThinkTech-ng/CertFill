import React from "react";
import { certificateAlignment } from "@/store/certificate";

interface AlignmentSelectorProps {
    selectedAlignment: string;
    onAlignmentChange: (alignment: string) => void;
}

const AlignmentSelector: React.FC<AlignmentSelectorProps> = ({ selectedAlignment, onAlignmentChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label>NAME PLACEMENT</label>
      <select
        id="font-selector"
        value={selectedAlignment}
        onChange={(e) => onAlignmentChange(e.target.value)}
        className="inputField block w-full flex-1"
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
    </div>
  );
};

export default AlignmentSelector;