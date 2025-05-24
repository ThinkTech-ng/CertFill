import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import customFetch from '@/service/https';
import { Button } from '@/components/molecule/button';
import { Switch } from '@/components/molecule/switch';
import { FileUpload } from '@/components/molecule/file-upload';
import { certificateFontFamily, certificateFontSize } from '@/store/certificate';

interface GradeFormProps {
  courseId: string;
}

function GradeForm({ courseId }: GradeFormProps) {
  const [certificate, setCertificate] = useState<File | null>(null);
  const [recipientsFile, setRecipientsFile] = useState<File | null>(null);
  const [certificateURL, setCertificateURL] = useState<string | null>(null);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [box, setBox] = useState<{
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
  } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>('font-inter');
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const [selectedFontSize, setSelectedFontSize] = useState<number>(16); // Default to 16px

  // Add a handler for font size changes
  const handleFontSizeChange = (size: number) => {
    setSelectedFontSize(size);
  };

  const handleFileChange = (name: 'certificate' | 'recipients') => (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      if (name === 'certificate') {
        console.log('cert');
        setCertificate(file);
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL);
        setCertificateURL(fileURL);
        setPopupVisible(true); // Show the popup
      } else if (name === 'recipients') {
        setRecipientsFile(file);
      }
    }
  };

  //upload to server
  const uploadRecipientFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('recipients', file);

    try {
      const data = await customFetch(`/courses/${courseId}/upload-recipients`, {
        method: 'POST',
        body: formData,
      });

      toast.success('Recipient file uploaded successfully:', data);
      return data.data;
    } catch (error) {
      toast.error('Error uploading recipient file:', error);
      throw error;
    }
  };

  console.log(box);

  const uploadCertFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const data = await customFetch(`/certificates/upload-certificate`, {
        method: 'POST',
        body: formData,
      });

      toast.success('Certificate file uploaded successfully');
      return data.data; // Assuming the API returns the URL in the 'url' field
    } catch (error) {
      toast.error('Error uploading certificate file');
      throw error;
    }
  };

  const saveCertificateDetails = async () => {
    if (!certificate || !box) {
      alert('Please upload a certificate and add a text box.');
      return;
    }

    try {
      const certificateFileURL = await uploadCertFile(certificate);
      const certificateDetails = {
        course: courseId,
        fontSize: selectedFontSize,
        fontFamily: selectedFont,
        position: {
          x: box.x,
          y: box.y,
        },
        certificateFile: certificateFileURL,
      };
      const { data } = await customFetch('/certificates', {
        method: 'POST',
        body: JSON.stringify(certificateDetails),
      });

      console.log('Certificate details saved successfully:', data);
      setCertificateId(data._id);
      toast.success('Certificate details saved successfully');
    } catch (error) {
      console.error('Error saving certificate details:', error);
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (!recipientsFile || !certificateId) {
        throw new Error('Please upload a recipients file and certificate');
      }
      const recipipentFileUrl = await uploadRecipientFile(recipientsFile);
      const courseUpdate = {
        certificateId: certificateId,
        recipientsCsvFile: recipipentFileUrl,
      };
      const response = await customFetch(`/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(courseUpdate),
      });

      // const data = await response.json();
      console.log('Course saved successfully:', response.data);
      toast.success('Course saved successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Error saving course');
    }
  };

  const handleAddBox = (e: React.MouseEvent<HTMLDivElement>) => {
    if (box) return; // Prevent creating multiple boxes

    const containerRect = e.currentTarget.getBoundingClientRect();

    // Box dimensions (you can customize these)
    const boxWidth = 450;
    const boxHeight = 50;

    // Get the center of the clicked point
    const x = e.clientX - containerRect.left - boxWidth / 2;
    const y = e.clientY - containerRect.top - boxHeight / 2;

    setBox({ x, y, text: 'Enter Name', width: boxWidth, height: boxHeight });
    console.log(x, y);
  };

  const handleTextChange = (text: string) => {
    setBox((prev) => (prev ? { ...prev, text } : null));
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
  };

  const handleDragStart = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();

    console.log('Mouse down detected');

    const startX = e.clientX;
    const startY = e.clientY;

    const initialX = box?.x ?? 0;
    const initialY = box?.y ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      console.log('Mouse is moving...');

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newX = initialX;
      let newY = initialY;

      // Depending on the corner, update the position
      if (corner === 'top-left') {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === 'top-right') {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === 'bottom-left') {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === 'bottom-right') {
        newX = initialX + dx;
        newY = initialY + dy;
      }

      setBox((prev) => (prev ? { ...prev, x: newX, y: newY } : null));
    };
    const handleMouseUp = () => {
      console.log('Mouse up detected');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach event listeners to track mouse movements and release
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  };

  const handleSave = async () => {
    if (!certificate) {
      alert('Please upload a certificate.');
      return;
    }

    saveCertificateDetails();
    setPopupVisible(false); // Close the popup
    router.refresh(); // Refresh or navigate to another page
  };

  // Detect clicks outside of the box to remove focus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [box]);

  return (
    <div className="mx-auto flex w-full max-w-[700px] max-h-[500px]">
      <form className="w-full ">
        <FileUpload
          label="Certificate File (.pdf)"
          uploadText=" Attach"
          accept=".pdf"
          onFileChange={handleFileChange('certificate')}
        />
        <span className="text-jumbo text-[13px]">Max size is 5mb</span>

        <FileUpload
          label="Recipient File (.csv)"
          uploadText="Upload"
          accept=".csv"
          onFileChange={handleFileChange('recipients')}
        />

        <span className="text-jumbo text-[13px]">
          Download the CSV template here to see the correct data format before uploading.
          <a
            href="/RecipientSample.csv"
            download
            className="text-[#FF2B00] underline pl-1 cursor-pointer"
          >
            Download
          </a>
        </span>

        <Button
          className="mt-3 w-fit capitalize py-5"
          type="button"
          variant={'outline'}
          onClick={handleSaveCourse}
        >
          Save Changes
        </Button>

        {popupVisible && certificateURL && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-[1240px] max-w-[90%] h-[700px] max-h-[90%] bg-white flex flex-row justify-center gap-10 px-6 items-center ">
              <div className="flex flex-col gap-3">
                <div className="min-w-[315px] w-full flex gap-5">
                  <select
                    id="font-selector"
                    value={selectedFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="inputField block w-full flex-1"
                  >
                    <option value="" disabled>
                      Choose a font
                    </option>
                    {certificateFontFamily.map(({ class: fontClass, name }) => (
                      <option key={fontClass} value={fontClass}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <select
                    id="font-size-selector"
                    value={selectedFontSize}
                    onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                    className="inputField max-w-[75px] w-[50px]"
                  >
                    {certificateFontSize.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>{' '}
                <div></div>
                <button
                  type="button"
                  onClick={handleSave}
                  className="saveButton h-[56px] max-w-[388px]"
                >
                  Save and Exit
                </button>
              </div>

              <div className="overflow-hidden h-[373px] w-[527px] relative pdf-container">
                <iframe
                  src={`${certificateURL}#toolbar=0`}
                  className="w-full h-full border-0 "
                  title="PDF Preview"
                ></iframe>
                {!box && (
                  <div onClick={handleAddBox} className="absolute inset-0 bg-transparent"></div>
                )}

                {/* Render the box if it exists */}
                {box && (
                  <div
                    ref={boxRef}
                    className={`absolute p-2 text-black cursor-move text-sm font-bold ${
                      isFocused ? 'border-2 border-blue-500 outline-none' : ''
                    } ${selectedFont} ${selectedFontSize}`}
                    style={{
                      top: `${box.y}px`,
                      left: `${box.x}px`,
                      width: `${box.width}px`,
                      fontSize: `${selectedFontSize}px`,
                    }}
                    onClick={handleFocus} // Set focus when clicking the box
                    onBlur={handleBlur} // Remove focus when clicking outside
                  >
                    {/* The box content */}
                    <input
                      type="text"
                      value={box.text}
                      onChange={(e) => handleTextChange(e.target.value)}
                      className="bg-transparent border-none focus:outline-none w-full text-center"
                    />

                    {/* Draggable corner points */}
                    {isFocused && (
                      <>
                        <div
                          onMouseDown={(e) => handleDragStart(e, 'top-left')}
                          className="absolute hover:bg-purple-600 -top-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, 'top-right')}
                          className="absolute hover:bg-purple-600 -top-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, 'bottom-left')}
                          onClick={(e) => handleDragStart(e, 'bottom-left')}
                          className="absolute hover:bg-purple-600 -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, 'bottom-right')}
                          className="absolute hover:bg-purple-600 -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default GradeForm;
