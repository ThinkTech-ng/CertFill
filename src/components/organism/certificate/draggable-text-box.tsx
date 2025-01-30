import React, { useRef } from "react";
import { certificatePreviewFontSizeWidth } from "@/store/certificate";

interface DraggableTextBoxProps {
  box: {
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
  };
  selectedFont: string;
  selectedFontSize: number;
  onTextChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  onDragStart: (e: React.MouseEvent, corner: string, ...args:any) => void;
}

const DraggableTextBox: React.FC<DraggableTextBoxProps> = ({
  box,
  selectedFont,
  selectedFontSize,
  onTextChange,
  onFocus,
  onBlur,
  isFocused,
  onDragStart,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={boxRef}
      draggable
      onDragStart={(e) => onDragStart(e, "top-left", boxRef)}

      className={`relative bg-transparent text-black cursor-move text-sm font-bold ${
        isFocused ? "border-2 border-blue-500 outline-none " : ""
      } ${selectedFont}`}
      style={{
        top: `${box.y}px`,
        left: `${box.x}px`,
        // width: `fit-content`,
        fontSize: `${certificatePreviewFontSizeWidth[selectedFontSize]}px`,
        // transform: 'scale(0.56)'
        // maxWidth: '70%'
        width: 300
      }}
      onClick={onFocus}
      onBlur={onBlur}
      onMouseLeave={onBlur}
    >
      <input
        type="text"
        value={box.text}
        onChange={(e) => onTextChange(e.target.value)}
        className="bg-transparent border-none focus:outline-none w-fit text-center"
      />

      {isFocused && (
        <>
          <div
          draggable
            onMouseDown={(e) => onDragStart(e, "top-left", boxRef)}
            onDragStart={(e) => onDragStart(e, "top-left", boxRef)}
            className="absolute hover:bg-purple-600 -top-1.5 -left-1.5 w-3 h-3 bg-red-500 border-black border rounded-full  cursor-resize"
          ></div>
          <div
          draggable
            onMouseDown={(e) => onDragStart(e, "top-right", boxRef)}
            onDragStart={(e) => onDragStart(e, "top-right", boxRef)}
            className="absolute hover:bg-purple-600 -top-1.5 -right-1.5 w-3 h-3 bg-orange-500 border-black border rounded-full  cursor-resize"
          ></div>
          <div
          draggable
            onMouseDown={(e) => onDragStart(e, "bottom-left", boxRef)}
            onDragStart={(e) => onDragStart(e, "bottom-left", boxRef)}
            className="absolute hover:bg-purple-600 -bottom-1.5 -left-1.5 w-3 h-3 bg-green-500 border-black border rounded-full  cursor-resize"
          ></div>
          <div
          draggable
            onMouseDown={(e) => onDragStart(e, "bottom-right", boxRef)}
            onDragStart={(e) => onDragStart(e, "bottom-right", boxRef)}
            className="absolute hover:bg-purple-600 -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border-black border rounded-full  cursor-resize"
          ></div>
        </>
      )}
    </div>
  );
};

export default DraggableTextBox;