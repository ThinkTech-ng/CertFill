'use client';

import React, { useState, useRef, useEffect } from 'react';

import FontSelector from './font-selector';
import FontSizeSelector from './font-size-selector';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import AlignmentSelector from './alignment-selector';
import ScaleButton from './scale-button';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { Text as KonvaText } from 'konva/lib/shapes/Text';

interface CertificateUploadPopupProps {
  certificateURL: string;
  onSave: (stageData: any) => void;
  selectedFont: string;
  selectedFontSize: number;
  selectedAlignment: string;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onAlignmentChange: (alignment: string) => void;
  handleFileChange: (files: FileList | null) => void;
}

const CertificateUploadPopup: React.FC<CertificateUploadPopupProps> = ({
  certificateURL,
  onSave,
  selectedFont,
  selectedFontSize,
  selectedAlignment,
  onFontChange,
  onFontSizeChange,
  onAlignmentChange,
}) => {
  const [mounted, setMounted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const [stageDimensions, setStageDimensions] = useState({ width: 595, height: 842 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 595, height: 842 });
  const [image, setImage] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStage>(null);
  const textRef = useRef<KonvaText>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [initialScale, setInitialScale] = useState(1);

  // Calculate the best fit scale for the image
  const calculateFitScale = (imgWidth: number, imgHeight: number) => {
    if (!scrollContainerRef.current) return 0.5; // Default fallback
    
    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const maxWidth = containerRect.width - 80; // Account for padding and borders
    const maxHeight = containerRect.height - 80;
    
    // Ensure we have valid dimensions
    if (maxWidth <= 0 || maxHeight <= 0 || imgWidth <= 0 || imgHeight <= 0) {
      return 0.5; // Safe fallback
    }
    
    const scaleX = maxWidth / imgWidth;
    const scaleY = maxHeight / imgHeight;
    
    const fitScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond original size
    return Math.max(fitScale, 0.1); // Ensure minimum scale
  };

  // Only render the canvas on the client side
  useEffect(() => {
    setMounted(true);

    const loadImage = async () => {
      const img = new window.Image();
      img.src = certificateURL;
      img.crossOrigin = 'anonymous'; // Add crossOrigin for external image URLs
      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        
        setOriginalDimensions({ width: originalWidth, height: originalHeight });
        
        // Calculate fit scale to use most of the available viewport
        // Account for header (80px) + footer (100px) + padding
        const availableWidth = Math.min(window.innerWidth * 0.95, 1400) - 40; // 95vw minus padding
        const availableHeight = window.innerHeight * 0.95 - 180; // 95vh minus header/footer
        
        const scaleX = availableWidth / originalWidth;
        const scaleY = availableHeight / originalHeight;
        const fitScale = Math.min(scaleX, scaleY, 1); // Don't upscale
        
        // Set stage dimensions to the scaled size for immediate visibility
        const scaledWidth = originalWidth * fitScale;
        const scaledHeight = originalHeight * fitScale;
        
        setStageDimensions({
          width: scaledWidth,
          height: scaledHeight,
        });
        
        setInitialScale(fitScale);
        setZoomScale(1); // Stage is already sized correctly, so scale is 1
        setImage(img as any);
        setImageLoading(false);
      };
    };
    loadImage();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      stage.scale({ x: zoomScale, y: zoomScale });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    }
  }, [zoomScale]);

  // Add mouse wheel zoom functionality
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const scaleBy = 1.1;
      const oldScale = zoomScale;
      let newScale = oldScale;
      
      if (e.deltaY < 0) {
        // Zoom in
        newScale = Math.min(oldScale * scaleBy, 3);
      } else {
        // Zoom out
        newScale = Math.max(oldScale / scaleBy, 0.1);
      }
      
      setZoomScale(newScale);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        scrollContainer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [zoomScale]);


  const saveStage = () => {
    const stage = stageRef.current;
    if (stage) {
      // Create a new stage with original dimensions for saving
      const originalStage = stage.clone();
      
      // Scale the stage back to original dimensions
      const scaleRatio = originalDimensions.width / stageDimensions.width;
      originalStage.size({
        width: originalDimensions.width,
        height: originalDimensions.height
      });
      
      // Scale all elements back to original coordinates
      originalStage.find('Image').forEach((node: any) => {
        node.size({
          width: originalDimensions.width,
          height: originalDimensions.height
        });
        const imageObj = node.image();
        if (imageObj?.src) {
          node.setAttr('src', imageObj.src);
        }
      });
      
      originalStage.find('Text').forEach((node: any) => {
        const currentX = node.x();
        const currentY = node.y();
        const currentFontSize = node.fontSize();
        
        node.x(currentX * scaleRatio);
        node.y(currentY * scaleRatio);
        node.fontSize(currentFontSize * scaleRatio);
      });

      onSave(originalStage.scale({ x: 1, y: 1 }).position({ x: 0, y: 0 }).batchDraw());
    }
  };

  const zoomStage = (scaleBy: number, type: string) => {
    const stage = stageRef.current;
    if (stage) {
      const oldScale = zoomScale;
      let newScale = 1;

      switch (type) {
        case 'zoomIn':
          newScale = Math.min(oldScale * scaleBy, 3); // Max zoom 3x
          break;
        case 'zoomOut':
          newScale = Math.max(oldScale / scaleBy, 0.3); // Min zoom 30%
          break;
        case 'reset':
          newScale = 1; // Reset to fit scale (stage is already properly sized)
          break;
      }

      setZoomScale(newScale);
    }
  };

  const handleFontChange = (font: string) => {
    const fontFamily = font.replace('font-', '');
    onFontChange(font);
    textRef.current?.fontFamily(fontFamily);
    stageRef.current?.batchDraw();
  };

  if (!mounted || imageLoading) return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg">
        <div className="text-center">Loading certificate preview...</div>
      </div>
    </div>
  );

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-[95vw] h-[95vh] bg-white flex flex-col overflow-hidden">
        {/* Header with controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-lg font-semibold">Certificate Upload</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Zoom: {Math.round(zoomScale * 100)}%
            </span>
            <div className="flex gap-2">
              <ScaleButton onClick={() => zoomStage(1.1, 'zoomIn')} type="zoomIn" />
              <ScaleButton onClick={() => zoomStage(1.1, 'zoomOut')} type="zoomOut" />
              <ScaleButton
                onClick={() => zoomStage(1, 'reset')}
                type="reset"
                backgroundColor="#F15F4B"
              />
            </div>
          </div>
        </div>

        {/* Main image area - uses full available space */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center"
        >
          <div 
            ref={containerRef} 
            className="flex items-center justify-center"
          >
            <Stage
              ref={stageRef}
              width={stageDimensions.width}
              height={stageDimensions.height}
              draggable={false}
            >
              <Layer>
                {image && (
                  <KonvaImage
                    image={image}
                    width={stageDimensions.width}
                    height={stageDimensions.height}
                  />
                )}
                {
                  <Text
                    text="Drag to Recipient Name Position"
                    x={stageDimensions.width / 2}
                    y={stageDimensions.height / 2}
                    fontFamily={selectedFont || 'Arial'}
                    fontSize={(selectedFontSize || 20) * (stageDimensions.width / originalDimensions.width)}
                    fill="red"
                    stroke="white"
                    strokeWidth={1}
                    id="nameTextHolder"
                    ref={textRef}
                    draggable={true}
                    // dragBoundFunc={limitTextDragArea}
                  />
                }
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Footer with controls */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-3 items-center justify-center flex-wrap">
            <AlignmentSelector
              selectedAlignment={selectedAlignment}
              onAlignmentChange={onAlignmentChange}
            />
            <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
            <FontSizeSelector
              selectedFontSize={selectedFontSize}
              onFontSizeChange={onFontSizeChange}
            />
            <button
              type="button"
              onClick={saveStage}
              className="saveButton h-[56px] px-6"
            >
              Save and Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadPopup;
