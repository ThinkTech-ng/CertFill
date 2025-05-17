import React, { useRef } from 'react';

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
  onDragStart: (e: React.MouseEvent, corner: string) => void;
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
      className={`absolute p-2 text-black cursor-move text-sm font-bold ${
        isFocused ? 'border-2 border-blue-500 outline-none' : ''
      } ${selectedFont}`}
      style={{
        top: `${box.y}px`,
        left: `${box.x}px`,
        width: `${box.width}px`,
        fontSize: `${selectedFontSize}px`,
      }}
      onClick={onFocus}
      onBlur={onBlur}
    >
      <input
        type="text"
        value={box.text}
        onChange={(e) => onTextChange(e.target.value)}
        className="bg-transparent border-none focus:outline-none w-full text-center"
      />

      {isFocused && (
        <>
          <div
            onMouseDown={(e) => onDragStart(e, 'top-left')}
            className="absolute hover:bg-purple-600 -top-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
          ></div>
          <div
            onMouseDown={(e) => onDragStart(e, 'top-right')}
            className="absolute hover:bg-purple-600 -top-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
          ></div>
          <div
            onMouseDown={(e) => onDragStart(e, 'bottom-left')}
            className="absolute hover:bg-purple-600 -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
          ></div>
          <div
            onMouseDown={(e) => onDragStart(e, 'bottom-right')}
            className="absolute hover:bg-purple-600 -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
          ></div>
        </>
      )}
    </div>
  );
};

export default DraggableTextBox;
