import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GradeFormProps {
  courseId: string;
}

function GradeForm({ courseId }: GradeFormProps) {
  const [certificate, setCertificate] = useState<File | null>(null);
  const [certificateURL, setCertificateURL] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [box, setBox] = useState<{
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
  } | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>("font-inter");
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (event.target.name === "certificate") {
        console.log("cert");
        setCertificate(file);
        const fileURL = URL.createObjectURL(file);
        console.log(fileURL);
        setCertificateURL(fileURL);
        setPopupVisible(true); // Show the popup
      } else if (event.target.name === "recipients") {
        uploadRecipientFile(file);
      }
    }
  };

  const handleCertificateUpload = () => {
    const input = document.querySelector(
      'input[name="certificate"]'
    ) as HTMLInputElement;
    if (input) {
      input.click(); // Trigger the file input programmatically
    }
  };

  const handleReciepientUpload = () => {
    const input = document.querySelector(
      'input[name="recipients"]'
    ) as HTMLInputElement;
    if (input) {
      input.click(); // Trigger the file input programmatically
    }
  };
  //upload to server
  const uploadRecipientFile = async (file: File) => {
    const formData = new FormData();
    formData.append("recipients", file);

    try {
      const response = await fetch(
        `https://certfillapi.reckonio.com/api/courses/${courseId}/upload-recipients`,
        {
          headers: {
            "X-Api-Key":
              "f171668084a1848bca2875372bf209c96232880dbbc6fa9541435ede3b6e1590",
          },
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload recipient file");
      }

      const data = await response.json();
      console.log("Recipient file uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading recipient file:", error);
    }
  };

  const uploadCertFile = async (file: File) => {
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const response = await fetch(
        `https://certfillapi.reckonio.com/api/certificates/upload-certificate`,
        {
          headers: {
            "X-Api-Key":
              "f171668084a1848bca2875372bf209c96232880dbbc6fa9541435ede3b6e1590",
          },
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload recipient file");
      }

      const data = await response.json();
      console.log("Recipient file uploaded successfully:", data);
    } catch (error) {
      console.error("Error uploading recipient file:", error);
    }
  };

  const saveCertificateDetails = async () => {
    if (!certificate || !box) {
      alert("Please upload a certificate and add a text box.");
      return;
    }

    const certificateDetails = {
      course: courseId,
      fontSize: 16,
      fontFamily: selectedFont,
      position: {
        x: box.x,
        y: box.y,
      },
      certificateFile: certificate.name,
    };

    try {
      const response = await fetch(
        "https://certfillapi.reckonio.com/api/certificates",
        {
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key":
              "f171668084a1848bca2875372bf209c96232880dbbc6fa9541435ede3b6e1590",
          },
          method: "POST",
          body: JSON.stringify(certificateDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save certificate details");
      }

      const data = await response.json();
      console.log("Certificate details saved successfully:", data);
    } catch (error) {
      console.error("Error saving certificate details:", error);
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

    setBox({ x, y, text: "Enter Name", width: boxWidth, height: boxHeight });
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

    console.log("Mouse down detected");

    const startX = e.clientX;
    const startY = e.clientY;

    const initialX = box?.x ?? 0;
    const initialY = box?.y ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      console.log("Mouse is moving...");

      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newX = initialX;
      let newY = initialY;

      // Depending on the corner, update the position
      if (corner === "top-left") {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === "top-right") {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === "bottom-left") {
        newX = initialX + dx;
        newY = initialY + dy;
      } else if (corner === "bottom-right") {
        newX = initialX + dx;
        newY = initialY + dy;
      }

      setBox((prev) => (prev ? { ...prev, x: newX, y: newY } : null));
    };
    const handleMouseUp = () => {
      console.log("Mouse up detected");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Attach event listeners to track mouse movements and release
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  };
  const handleSave = async () => {
    if (!certificate) {
      alert("Please upload a certificate.");
      return;
    }

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [box]);

  return (
    <div className="mx-auto flex w-full max-w-[700px] max-h-[500px]">
      <form className="w-full ">
        <div className="inputField flex flex-row justify-between items-center my-2">
          <label>Certificate File (.pdf)</label>
          <input
            type="file"
            name="certificate"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
            required
          />
          <button
            type="button"
            onClick={handleCertificateUpload()}
            className="bg-black px-9 py-2.5 text-white rounded-lg text-xs"
          >
            Attach
          </button>
        </div>

        <div className="inputField flex flex-row justify-between items-center">
          <label>Recipient File (.csv)</label>
          <input
            type="file"
            name="recipients"
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
            required
          />
          <button
            type="button"
            onClick={handleReciepientUpload}
            className="bg-black px-9 py-2.5 text-white rounded-lg text-xs"
          >
            Upload
          </button>
        </div>

        {popupVisible && certificateURL && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="w-[1240px] max-w-[90%] h-[700px] max-h-[90%] bg-white flex flex-row justify-center gap-10 px-6 items-center ">
              <div className="flex flex-col gap-3">
                <div className="w-[388px]">
                  <label
                    htmlFor="font-selector"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Select Font
                  </label>
                  <select
                    id="font-selector"
                    value={selectedFont}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="" disabled>
                      Choose a font
                    </option>
                    {[
                      { class: "font-inter", name: "Inter" },
                      { class: "font-roboto", name: "Roboto" },
                      { class: "font-lora", name: "Lora" },
                      { class: "font-poppins", name: "Poppins" },
                      { class: "font-montserrat", name: "Montserrat" },
                      { class: "font-dancing-script", name: "Dancing Script" },
                    ].map(({ class: fontClass, name }) => (
                      <option key={fontClass} value={fontClass}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

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
                  <div
                    onClick={handleAddBox}
                    className="absolute inset-0 bg-transparent"
                  ></div>
                )}

                {/* Render the box if it exists */}
                {box && (
                  <div
                    ref={boxRef}
                    className={`absolute p-2 text-black cursor-move text-sm font-bold ${
                      isFocused ? "border-2 border-blue-500 outline-none" : ""
                    } ${selectedFont}`}
                    style={{
                      top: `${box.y}px`,
                      left: `${box.x}px`,
                      width: `${box.width}px`,
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
                          onMouseDown={(e) => handleDragStart(e, "top-left")}
                          className="absolute hover:bg-purple-600 -top-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "top-right")}
                          className="absolute hover:bg-purple-600 -top-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "bottom-left")}
                          className="absolute hover:bg-purple-600 -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) =>
                            handleDragStart(e, "bottom-right")
                          }
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
