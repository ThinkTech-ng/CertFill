'use client';

import React, { useState, useRef, useEffect } from 'react';

import FontSelector from './font-selector';
import FontSizeSelector from './font-size-selector';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import AlignmentSelector from './alignment-selector';
import ScaleButton from './scale-button';
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { Text as KonvaText } from 'konva/lib/shapes/Text';
import { Switch } from '@/components/molecule/switch';

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
  const [originalDimensions, setOriginalDimensions] = useState({ width: 595, height: 842 });
  const [image, setImage] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStage>(null);
  const textRef = useRef<KonvaText>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Toggle states for showing/hiding data fields
  const [showIdNumber, setShowIdNumber] = useState(false);
  const [showGrade, setShowGrade] = useState(false);
  const [showInstructor, setShowInstructor] = useState(false);
  const [showCustom1, setShowCustom1] = useState(false);
  const [showCustom2, setShowCustom2] = useState(false);
  const [showVerificationLink, setShowVerificationLink] = useState(false);

  // Position states for each text element
  const [idNumberPosition, setIdNumberPosition] = useState({ x: 0.1, y: 0.1 });
  const [gradePosition, setGradePosition] = useState({ x: 0.1, y: 0.15 });
  const [instructorPosition, setInstructorPosition] = useState({ x: 0.1, y: 0.2 });
  const [custom1Position, setCustom1Position] = useState({ x: 0.8, y: 0.1 });
  const [custom2Position, setCustom2Position] = useState({ x: 0.8, y: 0.15 });
  const [verificationLinkPosition, setVerificationLinkPosition] = useState({ x: 0.8, y: 0.2 });

  // Separate font states for Other Placeholder section
  const [otherPlaceholderFont, setOtherPlaceholderFont] = useState('Arial');
  const [otherPlaceholderFontSize, setOtherPlaceholderFontSize] = useState(16);

  // Calculate best fit dimensions for the canvas
  const calculateFitDimensions = (imgWidth: number, imgHeight: number) => {
    const containerWidth = canvasContainerRef.current?.clientWidth || 800;
    const containerHeight = canvasContainerRef.current?.clientHeight || 600;

    // Add padding
    const maxWidth = containerWidth - 40;
    const maxHeight = containerHeight - 40;

    const aspectRatio = imgWidth / imgHeight;
    let fitWidth = imgWidth;
    let fitHeight = imgHeight;

    // Scale down if image is larger than container
    if (imgWidth > maxWidth || imgHeight > maxHeight) {
      if (aspectRatio > maxWidth / maxHeight) {
        // Width is the limiting factor
        fitWidth = maxWidth;
        fitHeight = maxWidth / aspectRatio;
      } else {
        // Height is the limiting factor
        fitHeight = maxHeight;
        fitWidth = maxHeight * aspectRatio;
      }
    }

    return { width: fitWidth, height: fitHeight };
  };

  // Only render the canvas on the client side
  useEffect(() => {
    setMounted(true);

    const loadImage = async () => {
      const img = new window.Image();
      img.src = certificateURL;
      img.crossOrigin = 'anonymous'; // Add crossOrigin for external image URLs
      img.onload = () => {
        setOriginalDimensions({
          width: img.width,
          height: img.height,
        });

        // Calculate dimensions that fit the container
        const fitDimensions = calculateFitDimensions(img.width, img.height);
        setStageDimensions(fitDimensions);
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
      
      if (containerRef.current) {
        containerRef.current.style.width = `${stage.width() * zoomScale}px`;
        containerRef.current.style.height = `${stage.height() * zoomScale}px`;
      }
    }
  }, [zoomScale]);


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

  const handleOtherPlaceholderFontChange = (font: string) => {
    setOtherPlaceholderFont(font);
    stageRef.current?.batchDraw();
  };

  if (!mounted) return <div>Loading preview canvas...</div>;

  return (
    <div className="fixed z-30 inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="w-full max-w-[1400px] h-[90vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header with Zoom Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-xl font-semibold">Certificate Upload & Configuration</h1>
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

        {/* Main Content - Top/Bottom Layout */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top - Canvas Area */}
          <div className="flex-1 flex flex-col overflow-hidden border-b border-gray-200">
            {/* Scrollable Canvas Container */}
            <div
              ref={canvasContainerRef}
              className="flex-1 overflow-auto bg-gray-100 p-4"
            >
              <div className="flex items-center justify-center min-h-full">
                <div ref={containerRef} className="bg-white shadow-lg">
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
                          text="Full Name of Recipient"
                          x={stageDimensions.width / 2}
                          y={stageDimensions.height / 2}
                          fontFamily={selectedFont || 'Arial'}
                          fontSize={selectedFontSize || 20}
                          fill="black"
                          id="name"
                          ref={textRef}
                          draggable={true}
                          // dragBoundFunc={limitTextDragArea}
                        />
                      }

                      {/* ID Number Text */}
                      {showIdNumber && (
                        <Text
                          text="ID: 12345"
                          x={stageDimensions.width * idNumberPosition.x}
                          y={stageDimensions.height * idNumberPosition.y}
                          fontFamily={otherPlaceholderFont || 'Arial'}
                          fontSize={otherPlaceholderFontSize || 16}
                          fill="black"
                          id="idNumber"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = e.target.x() / stageDimensions.width;
                            const newY = e.target.y() / stageDimensions.height;
                            setIdNumberPosition({ x: newX, y: newY });
                          }}
                        />
                      )}

                      {/* Grade Text */}
                      {showGrade && (
                        <Text
                          text="Grade: A+"
                          x={stageDimensions.width * gradePosition.x}
                          y={stageDimensions.height * gradePosition.y}
                          fontFamily={otherPlaceholderFont || 'Arial'}
                          fontSize={otherPlaceholderFontSize || 16}
                          fill="black"
                          id="grade"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = e.target.x() / stageDimensions.width;
                            const newY = e.target.y() / stageDimensions.height;
                            setGradePosition({ x: newX, y: newY });
                          }}
                        />
                      )}

                      {/* Instructor Text */}
                      {showInstructor && (
                        <Text
                          text="Instructor: John Doe"
                          x={stageDimensions.width * instructorPosition.x}
                          y={stageDimensions.height * instructorPosition.y}
                          fontFamily={otherPlaceholderFont || 'Arial'}
                          fontSize={otherPlaceholderFontSize || 16}
                          fill="black"
                          id="instructor"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = e.target.x() / stageDimensions.width;
                            const newY = e.target.y() / stageDimensions.height;
                            setInstructorPosition({ x: newX, y: newY });
                          }}
                        />
                      )}

                      {/* Custom 1 Text */}
                      {showCustom1 && (
                        <Text
                          text="Custom 1: Value"
                          x={stageDimensions.width * custom1Position.x}
                          y={stageDimensions.height * custom1Position.y}
                          fontFamily={otherPlaceholderFont || 'Arial'}
                          fontSize={otherPlaceholderFontSize || 16}
                          fill="black"
                          id="custom1"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = e.target.x() / stageDimensions.width;
                            const newY = e.target.y() / stageDimensions.height;
                            setCustom1Position({ x: newX, y: newY });
                          }}
                        />
                      )}

                      {/* Custom 2 Text */}
                      {showCustom2 && (
                        <Text
                          text="Custom 2: Value"
                          x={stageDimensions.width * custom2Position.x}
                          y={stageDimensions.height * custom2Position.y}
                          fontFamily={otherPlaceholderFont || 'Arial'}
                          fontSize={otherPlaceholderFontSize || 16}
                          fill="black"
                          id="custom2"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = e.target.x() / stageDimensions.width;
                            const newY = e.target.y() / stageDimensions.height;
                            setCustom2Position({ x: newX, y: newY });
                          }}
                        />
                      )}

                      {/* Verification Link Text */}
                      {showVerificationLink && (
                        <Text
                          text="Verify: certfill.com/verify/123"
                          x={stageDimensions.width * verificationLinkPosition.x}
                          y={stageDimensions.height * verificationLinkPosition.y}
                          fontFamily={otherPlaceholderFont || 'Arial'}
                          fontSize={otherPlaceholderFontSize || 16}
                          fill="black"
                          id="verificationLink"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = e.target.x() / stageDimensions.width;
                            const newY = e.target.y() / stageDimensions.height;
                            setVerificationLinkPosition({ x: newX, y: newY });
                          }}
                        />
                      )}
                    </Layer>
                  </Stage>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom - Controls Panel */}
          <div className="h-auto bg-white border-t-2 border-gray-200 p-3">
            <div className="grid grid-cols-5 gap-4 items-start">
              {/* Full Name Controls */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-1">FULL NAME</h3>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-600 whitespace-nowrap">Placement:</label>
                  <AlignmentSelector
                    selectedAlignment={selectedAlignment}
                    onAlignmentChange={onAlignmentChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-600 whitespace-nowrap">Font:</label>
                  <FontSelector selectedFont={selectedFont} onFontChange={handleFontChange} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-600 whitespace-nowrap">Size:</label>
                  <FontSizeSelector
                    selectedFontSize={selectedFontSize}
                    onFontSizeChange={onFontSizeChange}
                  />
                </div>
              </div>

              {/* Other Placeholders Controls */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-1">OTHER FIELDS</h3>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-600 whitespace-nowrap">Font:</label>
                  <FontSelector selectedFont={otherPlaceholderFont} onFontChange={handleOtherPlaceholderFontChange} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-gray-600 whitespace-nowrap">Size:</label>
                  <FontSizeSelector
                    selectedFontSize={otherPlaceholderFontSize}
                    onFontSizeChange={setOtherPlaceholderFontSize}
                  />
                </div>
              </div>

              {/* Field Toggles - Column 1 */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-1">SHOW FIELDS</h3>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700">ID Number</label>
                  <Switch checked={showIdNumber} onCheckedChange={setShowIdNumber} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700">Grade</label>
                  <Switch checked={showGrade} onCheckedChange={setShowGrade} />
                </div>
              </div>

               <div className="flex flex-col gap-1.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 opacity-0">FIELDS</h3>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700">Verify Link</label>
                  <Switch checked={showVerificationLink} onCheckedChange={setShowVerificationLink} />
                </div>
               <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700">Instructor</label>
                  <Switch checked={showInstructor} onCheckedChange={setShowInstructor} />
                </div>
              </div>

              {/* Field Toggles - Column 2 */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xs font-semibold text-gray-900 mb-1 opacity-0">FIELDS</h3>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700">Custom 1</label>
                  <Switch checked={showCustom1} onCheckedChange={setShowCustom1} />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-700">Custom 2</label>
                  <Switch checked={showCustom2} onCheckedChange={setShowCustom2} />
                </div>
                    {/* Save Button - Right aligned */}
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={saveStage}
                  className="saveButton h-8 px-8 text-xs whitespace-nowrap"
                >
                  Save and Exit
                </button>
              </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadPopup;
