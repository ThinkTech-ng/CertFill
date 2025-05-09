'use client';

import React, { useState, useRef, useEffect } from "react";
import { FileUpload } from "@/components/molecule/file-upload";

import FontSelector from "./font-selector";
import FontSizeSelector from "./font-size-selector";
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import AlignmentSelector from "./alignment-selector";

interface CertificateUploadPopupProps {
  certificateURL: string;
  onSave: (stageData: any) => void;
  selectedFont: string;
  selectedFontSize: number;
  selectedAlignment: string;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onAlignmentChange: (alignment: string) => void;
  handleFileChange: (files: FileList | null) => void
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
  handleFileChange
}) => {
  const [mounted, setMounted] = useState(false);

  // Only render the canvas on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const [stageDimensions, setStageDimensions] = useState({ width: 595, height: 842 });  
  const [_, setTextPosition] = useState({ x: 0, y: 0, relativeX: 0, relativeY: 0 });

  const [image, setImage] = useState(null);
  const stageRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  useEffect(() => {
    const loadImage = async () => {
      const img = new window.Image();
      img.src = certificateURL;
      img.crossOrigin = "anonymous"; // Add crossOrigin for external image URLs
      img.onload = () => { 
        setStageDimensions({ 
          ...stageDimensions,
          width: img.width, 
          height: img.height 
        });
        setImage(img as any);
      };
    };
    loadImage();
  }, []);

  const handleTextDragged = () => {
    // Get the position relative to the canvas
    if (textRef.current) {
      const position = textRef.current.position();

      setTextPosition({
        x: position.x,
        y: position.y,
        relativeX: position.x / stageDimensions.width,
        relativeY: position.y / stageDimensions.height
      });
    }
  }

  const limitTextDragArea = (pos: { x: number, y: number }) => {
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
    
    return {x, y};
  }

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
  }

  const zoomStage = (scaleBy: number, isZoomIn: boolean) => {
    const stage = stageRef.current;
    if (stage) {
      const oldScale = stage.scaleX();
      const newScale = isZoomIn ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      stage.batchDraw();
    }
  }

  const resetZoom = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.scale({ x: 1, y: 1 });
      stage.position({ x: 0, y: 0 });
      stage.batchDraw();
    }
  }

  if (!mounted) return <div>Loading preview canvas...</div>;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-[1240px] max-w-[90%] max-h-[90%] bg-white max-sm:flex-col-reverse justify-center gap-10 px-6 items-center overflow-scroll">
        <div className="flex flex-col gap-3 mb-3">
          <div className="w-full flex gap-5">
            <FileUpload
              label="Certificate File (.png, .jpg, .jpeg)"
              uploadText="Browse"
              accept=".png, .jpg, .jpeg"
              onFileChange={handleFileChange}
              />
          </div>
          <div className="w-full flex gap-5">
            <FontSelector selectedFont={selectedFont} onFontChange={onFontChange} />
            <AlignmentSelector selectedAlignment={selectedAlignment} onAlignmentChange={onAlignmentChange} />
            <FontSizeSelector selectedFontSize={selectedFontSize} onFontSizeChange={onFontSizeChange} />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={saveStage}
              className="saveButton h-[56px] max-w-[388px]"
            >
              Save and Exit
            </button>
            <div className="top-2 right-2 flex gap-2 z-10">
              <button 
                onClick={() => zoomStage(1.2, true)}
                className="bg-certFillBlue text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-xl font-medium">+</span>
              </button>
              <button 
                onClick={() => zoomStage(1.2, false)}
                className="bg-certFillBlue text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-xl font-medium">-</span>
              </button>
              <button 
                onClick={resetZoom}
                className="bg-[red] text-white w-8 h-8 px-[29px] rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-sm font-medium">Reset</span>
              </button>
            </div>
          </div>

          <div className="relative pdf-container w-full h-full max-h-[500px] overflow-scroll">
            <Stage 
              ref={stageRef} 
              width={stageDimensions.width} 
              height={stageDimensions.height}
              draggable={true}
            >
              <Layer>
                {image && <KonvaImage image={image} width={stageDimensions.width} height={stageDimensions.height} />}
                {<Text
                    text="Drag to Recipient Name Position"
                    x={stageDimensions.width/2}
                    y={stageDimensions.height/2}
                    fontFamily={selectedFont || "Arial"}
                    fontSize={selectedFontSize || 20}
                    fill="black"
                    id="nameTextHolder"
                    ref={textRef}
                    draggable={true}
                    dragBoundFunc={limitTextDragArea}
                    onDragEnd={handleTextDragged}
                  />}
              </Layer>
            </Stage>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateUploadPopup;