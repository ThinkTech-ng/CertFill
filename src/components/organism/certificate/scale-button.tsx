'use client';

import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import React from 'react';

interface ScaleButtonProps {
  onClick: () => void;
  type: 'zoomOut' | 'zoomIn' | 'reset';
  backgroundColor?: string;
}

const ScaleButton = ({ onClick, type, backgroundColor = '#D0F9FF' }: ScaleButtonProps) => {
  const renderIcon = () => {
    switch (type) {
      case 'zoomOut':
        return <ZoomOut className="w-6 h-6 text-black" />;
      case 'zoomIn':
        return <ZoomIn className="w-6 h-6 text-black" />;

      case 'reset':
      default:
        return <RotateCcw className="w-6 h-6 text-white text-bold" />;
    }
  };

  const bgClass = type === 'reset' ? 'bg-[#F15F4B]' : `bg-[#D0F9FF]`; // dynamic background color for zoomIn and zoomOut

  return (
    <button
      onClick={onClick}
      className={`${bgClass} w-12 h-12 rounded-lg flex items-center justify-center `}
      type="button"
    >
      {renderIcon()}
    </button>
  );
};

export default ScaleButton;
