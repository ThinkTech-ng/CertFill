import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import customFetch from "@/service/https";
import { Button } from "@/components/molecule/button";
import { Switch } from "@/components/molecule/switch"

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
  const [selectedFont, setSelectedFont] = useState<string>("font-inter");
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);
  const [selectedFontSize, setSelectedFontSize] = useState<number>(16); // Default to 16px

  // Add a handler for font size changes
  const handleFontSizeChange = (size: number) => {
    setSelectedFontSize(size);
  };

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
        setRecipientsFile(file);
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
  const uploadRecipientFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("recipients", file);

    try {
      const data = await customFetch(`/courses/${courseId}/upload-recipients`, {
        method: "POST",
        body: formData,
      });

      toast.success("Recipient file uploaded successfully:", data);
      return data.data;
    } catch (error) {
      toast.error("Error uploading recipient file:", error);
      throw error;
    }
  };

  console.log(box);

  const uploadCertFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const data = await customFetch(`/certificates/upload-certificate`, {
        method: "POST",
        body: formData,
      });

      toast.success("Certificate file uploaded successfully");
      return data.data; // Assuming the API returns the URL in the 'url' field
    } catch (error) {
      toast.error("Error uploading certificate file");
      throw error;
    }
  };

  const saveCertificateDetails = async () => {
    if (!certificate || !box) {
      alert("Please upload a certificate and add a text box.");
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
      const { data } = await customFetch("/certificates", {
        method: "POST",
        body: JSON.stringify(certificateDetails),
      });

      console.log("Certificate details saved successfully:", data);
      setCertificateId(data._id);
      toast.success("Certificate details saved successfully");
    } catch (error) {
      console.error("Error saving certificate details:", error);
    }
  };

  const handleSaveCourse = async () => {
    try {
      if (!recipientsFile || !certificateId) {
        throw new Error("Please upload a recipients file and certificate");
      }
      const recipipentFileUrl = await uploadRecipientFile(recipientsFile);
      const courseUpdate = {
        certificateId: certificateId,
        recipientsCsvFile: recipipentFileUrl,
      };
      const response = await customFetch(`/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(courseUpdate),
      });

      // const data = await response.json();
      console.log("Course saved successfully:", response.data);
      toast.success("Course saved successfully");
    } catch (error) {
      console.log(error)
      toast.error(error.message || "Error saving course");
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [box]);

  return (
    <div className="mx-auto flex w-full max-w-[700px] max-h-[500px]">
      <form className="w-full ">
        <div className="inputField flex flex-row justify-between items-center mt-3 h-[50px]">
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
            onClick={handleCertificateUpload}
            className="bg-black px-9 py-2.5 text-white rounded-lg text-xs"
          >
            Attach
          </button>
        </div>
        <span className="text-jumbo text-[13px]">Max size is 5mb</span>

        <div className="inputField flex flex-row justify-between items-center h-[50px] mt-4">
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
        <span className="text-jumbo text-[13px]">Download the CSV template here to see the correct data format before uploading. 
          <a href="/favicon.ico" download className="text-[#FF2B00] underline pl-1 cursor-pointer">Download</a>
        </span>

<div className="flex justify-between items-center py-3">
  <span>Send to individual mails
  </span>

  <Switch />

  </div>

        <Button
          className="mt-3 capitalize w-full h-[50px]"
          type="button"
          onClick={handleSaveCourse}
        >
          Proceed to Payment
        </Button>

      {/* { ' TODO': calculate the number of rows in the csv and show here with amount} */}
        <span>
          You've successfully uploaded 500 names. The total cost is 
          <strong>₦500,000</strong>
        </span>

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
                </div>{" "}
                <label
                  htmlFor="font-size-selector"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Select Font Size
                </label>
                <select
                  id="font-size-selector"
                  value={selectedFontSize}
                  onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                  className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {[14, 16, 18, 20, 24, 30].map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
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
                          onMouseDown={(e) => handleDragStart(e, "top-left")}
                          className="absolute hover:bg-purple-600 -top-1.5 -left-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "top-right")}
                          className="absolute hover:bg-purple-600 -top-1.5 -right-1.5 w-3 h-3 bg-white border-black border rounded-full  cursor-resize"
                        ></div>
                        <div
                          onMouseDown={(e) => handleDragStart(e, "bottom-left")}
                          onClick={(e) => handleDragStart(e, "bottom-left")}
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
