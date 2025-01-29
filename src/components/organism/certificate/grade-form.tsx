import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import customFetch from "@/service/https";
import { Button } from "@/components/molecule/button";
import { FileUpload } from "@/components/molecule/file-upload";
import CertificateUploadPopup from "@/components/organism/certificate/certificate-upload-popup";
import { env } from '../../../../env';
import { certificateTextTitle } from "@/store/certificate";
interface GradeFormProps {
  courseId: string;
  onSave: (course: any)=> void
}

function GradeForm({ courseId, onSave }: GradeFormProps) {
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
  const [selectedFontSize, setSelectedFontSize] = useState<number>(16);

  const handleFontSizeChange = (size: number) => {
    setSelectedFontSize(size);
  };
  const reset = ()=>{
    setCertificate(null)
setCertificateURL(null);
          setPopupVisible(false)
setRecipientsFile(null)
  }

  const handleFileChange =
    (name: "certificate" | "recipients") => (files: FileList | null) => {
      const file = files?.[0];
      if (file) {
        if (name === "certificate") {
          setCertificate(file);
          const fileURL = URL.createObjectURL(file);
          setCertificateURL(fileURL);
          setPopupVisible(true);
        } else if (name === "recipients") {
          setRecipientsFile(file);
        }
      }
    };

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

  const uploadCertFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const data = await customFetch(`/certificates/upload-certificate`, {
        method: "POST",
        body: formData,
      });

      toast.success("Certificate file uploaded successfully");
      return data.data;
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

      console.log("Course saved successfully:", response.data);
      toast.success("Course saved successfully");
      onSave(response.data)
      reset()
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error saving course");
    }
  };

  const handleAddBox = (e: React.MouseEvent<HTMLDivElement>) => {
    if (box) return;

    const containerRect = e.currentTarget.getBoundingClientRect();
    const boxWidth = 450;
    const boxHeight = 50;
    const x = e.clientX - containerRect.left - boxWidth / 2;
    const y = e.clientY - containerRect.top - boxHeight / 2;

    setBox({ x, y, text: certificateTextTitle, width: boxWidth, height: boxHeight });
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

    const startX = e.clientX;
    const startY = e.clientY;

    const initialX = box?.x ?? 0;
    const initialY = box?.y ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newX = initialX;
      let newY = initialY;

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
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
  };

  const handleSave = async () => {
    if (!certificate) {
      alert("Please upload a certificate.");
      return;
    }

    saveCertificateDetails();
    setPopupVisible(false);
    router.refresh();
  };

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
        <FileUpload
          label="Certificate File (.pdf)"
          uploadText=" Attach"
          accept=".pdf"
          onFileChange={handleFileChange("certificate")}
        />
        <span className="text-jumbo text-[13px]">Max size is 5mb</span>

        <FileUpload
          label="Recipient File (.csv)"
          uploadText="Upload"
          accept=".csv"
          onFileChange={handleFileChange("recipients")}
        />

        <span className="text-jumbo text-[13px]">
          Download the CSV template here to see the correct data format before
          uploading.
          <a
            href={env.RECIPIENT_SAMPLE_CSV}
            download
            className="text-[#FF2B00] underline pl-1 cursor-pointer"
          >
            Download
          </a>
        </span>

        <Button
          className="mt-3 w-fit capitalize py-5"
          type="button"
          variant={"outline"}
          onClick={handleSaveCourse}
        >
          Save Changes
        </Button>

        {popupVisible && certificateURL && (
          <CertificateUploadPopup
          handleFileChange={handleFileChange('certificate')}
            certificateURL={certificateURL}
            onSave={handleSave}
            onAddBox={handleAddBox}
            box={box}
            selectedFont={selectedFont}
            selectedFontSize={selectedFontSize}
            onFontChange={handleFontChange}
            onFontSizeChange={handleFontSizeChange}
            onTextChange={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            isFocused={isFocused}
            onDragStart={handleDragStart}
          />
        )}
      </form>
    </div>
  );
}

export default GradeForm;