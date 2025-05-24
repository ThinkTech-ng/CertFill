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

  const [stageDimensions, setStageDimensions] = useState({ width: 595, height: 842 });
  const [image, setImage] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStage>(null);
  const textRef = useRef<KonvaText>(null);
  const [zoomScale, setZoomScale] = useState(1);

  // Only render the canvas on the client side
  useEffect(() => {
    setMounted(true);

    const loadImage = async () => {
      const img = new window.Image();
      img.src = certificateURL;
      img.crossOrigin = 'anonymous'; // Add crossOrigin for external image URLs
      img.onload = () => {
        setStageDimensions({
          ...stageDimensions,
          width: img.width,
          height: img.height,
        });
        setImage(img as any);
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
      // containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [zoomScale]);

  const limitTextDragArea = (pos: { x: number; y: number }) => {
    // Get text dimensions
    const textNode = textRef.current;
    if (!textNode) return pos;

    const textWidth = textNode.width();
    const textHeight = textNode.height();

    // Calculate boundaries to keep text within stage
    // Ensure text stays within stage with proper margins
    // Prevent text from going too far left or right
    const x = Math.max(textWidth / 2, Math.min(pos.x, stageDimensions.width - textWidth / 2));
    const y = Math.max(0, Math.min(pos.y, stageDimensions.height - textHeight));

    return { x, y };
  };

  const saveStage = () => {
    const stage = stageRef.current;
    if (stage) {
      // Ensure all image nodes have `src` set before saving
      stage.find('Image').forEach((node: any) => {
        const imageObj = node.image();
        if (imageObj?.src) {
          node.setAttr('src', imageObj.src);
        }
      });

      onSave(stage.clone().scale({ x: 1, y: 1 }).position({ x: 0, y: 0 }).batchDraw());
    }
  };

  const zoomStage = (scaleBy: number, type: string) => {
    const stage = stageRef.current;
    if (stage) {
      const oldScale = stage.scaleX();
      let newScale = 1;

      switch (type) {
        case 'zoomIn':
          newScale = oldScale * scaleBy;
          break;
        case 'zoomOut':
          newScale = oldScale / scaleBy;
          break;
        case 'reset':
          newScale = 1;
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

  if (!mounted) return <div>Loading preview canvas...</div>;

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-[1240px] max-w-[90%] max-h-[95%] bg-white max-sm:flex-col-reverse justify-center gap-10 py-7 px-12 items-center overflow-scroll">
        <div className="flex items-center justify-between py-2">
          <h1>File Upload</h1>
          <div className="top-2 right-2 flex gap-2 z-10">
            <ScaleButton onClick={() => zoomStage(1.1, 'zoomIn')} type="zoomIn" />
            <ScaleButton onClick={() => zoomStage(1.1, 'zoomOut')} type="zoomOut" />
            <ScaleButton
              onClick={() => zoomStage(1, 'reset')}
              type="reset"
              backgroundColor="#F15F4B"
            />
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative pdf-container w-full h-full max-h-[500px] overflow-scroll flex items-center justify-center py-4"
        >
          <Stage
            ref={stageRef}
            width={stageDimensions.width}
            height={stageDimensions.height}
            draggable={true}
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
                  fontSize={selectedFontSize || 20}
                  fill="black"
                  id="nameTextHolder"
                  ref={textRef}
                  draggable={true}
                  // dragBoundFunc={limitTextDragArea}
                />
              }
            </Layer>
          </Stage>
        </div>

        <div className="flex flex-col gap-3 py-3">
          <div className="w-full flex gap-2 items-end justify-between">
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
              className="saveButton  h-[56px] max-w-[388px]"
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
