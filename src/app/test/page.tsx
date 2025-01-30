"use client"
import React, { useState } from 'react';

const DraggableInput = ({ style, onChange, text}) => {
    const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    // Calculate the offset between the mouse position and the input's position
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // Calculate the new position
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      // Get the dimensions of the parent div and the input field
      const parentRect = e.currentTarget.getBoundingClientRect();
      const inputWidth = 200; // Approximate width of the input field
      const inputHeight = 40; // Approximate height of the input field

      // Ensure the input stays within the bounds of the parent div
      const boundedX = Math.max(0, Math.min(newX, parentRect.width - inputWidth));
      const boundedY = Math.max(0, Math.min(newY, parentRect.height - inputHeight));

      // Update the position
      setPosition({
        x: boundedX,
        y: boundedY,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Log the final position when dragging stops
    console.log(`Input position: x=${position.x}, y=${position.y}`);
  }
  return (
    <section className="w-full h-screen bg-red-100">
    <div
      style={{
        width: '100%',
        height: '500px',
        position: 'relative',
        margin: 'auto'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="bg-orange-100"
    >
      <div
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          width: '200px',
          userSelect: "none"
        }}
        onMouseDown={handleMouseDown}
        placeholder="Enter full name"
        className="p-2 bg-transparent text-center rounded-none border-2 border-black outline outline-none"
      >{text || "Enter full name"}</div>
    </div>
    </section>
  );
};

export default DraggableInput;