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
  const [image, setImage] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<KonvaStage>(null);
  const textRef = useRef<KonvaText>(null);
  const [zoomScale, setZoomScale] = useState(1);

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
          className="relative pdf-container w-full h-full h-[500px] overflow-scroll flex items-center justify-center py-4"
        >
          <div ref={containerRef} className="items-center">
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

        <div className="flex flex-col gap-3 py-3">
          {/* Full Name Section */}
          <div className="w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Full Name</h3>
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
            </div>
          </div>

          {/* Other Placeholder Section */}
          <div className="w-full py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Other Placeholder</h3>
              <div className="w-5 h-5">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
            {/* Other Placeholder Controls */}
            <div className="w-full flex gap-2 items-end justify-left mb-6">
              <FontSelector selectedFont={otherPlaceholderFont} onFontChange={handleOtherPlaceholderFontChange} />
              <FontSizeSelector
                selectedFontSize={otherPlaceholderFontSize}
                onFontSizeChange={setOtherPlaceholderFontSize}
              />
            </div>
            
            {/* Data Field Toggles */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show ID Number</label>
                  <Switch
                    checked={showIdNumber}
                    onCheckedChange={setShowIdNumber}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Grade</label>
                  <Switch
                    checked={showGrade}
                    onCheckedChange={setShowGrade}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Instructor</label>
                  <Switch
                    checked={showInstructor}
                    onCheckedChange={setShowInstructor}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Custom 1</label>
                  <Switch
                    checked={showCustom1}
                    onCheckedChange={setShowCustom1}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Custom 2</label>
                  <Switch
                    checked={showCustom2}
                    onCheckedChange={setShowCustom2}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Show Verification Link</label>
                  <Switch
                    checked={showVerificationLink}
                    onCheckedChange={setShowVerificationLink}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="w-full flex justify-left">
              <button
                type="button"
                onClick={saveStage}
                className="saveButton h-[56px] max-w-[388px]"
              >
                Save and Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadPopup;
