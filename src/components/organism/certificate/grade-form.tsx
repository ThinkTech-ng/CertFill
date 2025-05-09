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
  const [selectedFont, setSelectedFont] = useState<string>("font-inter");
  const [selectedAlignment, setSelectedAlignment] = useState<string>("Center");
  const router = useRouter();
  const [selectedFontSize, setSelectedFontSize] = useState<number>(20);

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

  const saveCertificateDetails = async (canvasData: any) => {
    if (!certificate || !canvasData) {
      alert("Please upload a certificate and add a text box.");
      return;
    }

    try {
      const certificateFileURL = await uploadCertFile(certificate);
      const certificateDetails = {
        course: courseId,
        fontSize: selectedFontSize,
        fontFamily: selectedFont,
        certificateFile: certificateFileURL,
        alignment: selectedAlignment,
        canvasData: canvasData?.toJSON(),
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

      toast.success("Course saved successfully");
      onSave(response.data)
      reset()
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Error saving course");
    }
  };


  const handleSave = async (stageData: any) => {
    if (!certificate) {
      alert("Please upload a certificate.");
      return;
    }

    saveCertificateDetails(stageData);
    setPopupVisible(false);
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-[700px] max-h-[500px]">
      <form className="w-full ">
        <span className="text-jumbo text-[13px] text-neptuneSDream">Upload the certificate template image and position the name of the recipient text at the desired position.
          The recommended size is around <span className="font-weight-bold">842×595px</span></span>
        <FileUpload
          label="Certificate File (.png, .jpg, .jpeg)"
          uploadText=" Attach"
          accept=".png, .jpg, .jpeg"
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
            selectedFont={selectedFont}
            selectedFontSize={selectedFontSize}
            onFontChange={setSelectedFont}
            onFontSizeChange={setSelectedFontSize}
            selectedAlignment={selectedAlignment}
            onAlignmentChange={setSelectedAlignment}
          />
        )}
      </form>
    </div>
  );
}

export default GradeForm;