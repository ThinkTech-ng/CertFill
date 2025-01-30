import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/molecule/button";
import { FileUpload } from "@/components/molecule/file-upload";
import DraggableTextBox from "./draggable-text-box";
import FontSelector from "./font-selector";
import FontSizeSelector from "./font-size-selector";

interface CertificateUploadPopupProps {
  certificateURL: string;
  onSave: () => void;
  onAddBox: (e: React.MouseEvent<HTMLDivElement>) => void;
  box: {
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
  } | null;
  selectedFont: string;
  selectedFontSize: number;
  onFontChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onTextChange: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onPreview?: () => void;
  hasPreviewed?: boolean;
  isFocused: boolean;
  onDragStart: (e: React.MouseEvent, corner: string, ...args: any) => void;
  handleFileChange: (files: FileList | null) => void,
  iframeRef?: any;

pdfStyle?: any
pdfContainerStyle?: any
}

const CertificateUploadPopup: React.FC<CertificateUploadPopupProps> = ({
  certificateURL,
  onSave,
  onAddBox,
  box,
  selectedFont,
  selectedFontSize,
  onFontChange,
  onFontSizeChange,
  onTextChange,
  onFocus,
  onBlur,
  isFocused,
  onDragStart,
  handleFileChange,
  iframeRef,
  onPreview,
hasPreviewed,
pdfStyle,
pdfContainerStyle
}) => {
  console.log(iframeRef, 'in')
  const iref = React.useRef()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-[1240px] max-w-[90%] h-[700px] max-h-[90%] bg-white flex max-sm:flex-col-reverse justify-center gap-10 px-6 items-center " style={pdfContainerStyle}>
        <div className="flex flex-col gap-3">
          {!hasPreviewed && <>
          <div className="w-full flex gap-5">
          <FileUpload
            label="Certificate File (.pdf)"
            uploadText="Browse"
            accept=".pdf"
            onFileChange={handleFileChange}
            />
          </div>
          <div className="w-full flex gap-5">
            <FontSelector selectedFont={selectedFont} onFontChange={onFontChange} />
            <FontSizeSelector selectedFontSize={selectedFontSize} onFontSizeChange={onFontSizeChange} />
          </div>
          </>}
         <div className="flex gap-4">
         <Button
            type="button"
            onClick={onPreview}
            className="w-full max-w-[388px]"
            data-ref-name="certificate-upload-save"
          >
            { hasPreviewed ? 'Make Changes' : 'Generate Preview'}
          </Button>
          {hasPreviewed && <Button
            type="button"
            onClick={onSave}
            variant={'outline'}
            className="w-full max-w-[388px]"
            data-ref-name="certificate-upload-save"
          >
            Save and use format
          </Button>}
         </div>
          
        </div>

        <div className="overflow-hidden h-[373px] w-[527px] relative pdf-container" style={pdfStyle}>
          <iframe
            src={`${certificateURL}#toolbar=0`}
            className="w-full h-full border-0 absolute"
            title="PDF Preview"
            ref={iframeRef}
            id="certificate-upload-popup-iframe"
          ></iframe>
          {!box && (
            <div
              onClick={onAddBox}
              className="absolute inset-0 bg-transparent"
            ></div>
          )}

          {box && !hasPreviewed && (
            <DraggableTextBox
              box={box}
              selectedFont={selectedFont}
              selectedFontSize={selectedFontSize}
              onTextChange={onTextChange}
              onFocus={onFocus}
              onBlur={onBlur}
              isFocused={isFocused}
              onDragStart={onDragStart}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateUploadPopup;