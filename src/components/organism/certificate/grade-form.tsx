import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import customFetch from "@/service/https";
import { Button } from "@/components/molecule/button";
import { FileUpload } from "@/components/molecule/file-upload";
import CertificateUploadPopup from "@/components/organism/certificate/certificate-upload-popup";
import { env } from '../../../../env';
import { certificateTextTitle } from "@/store/certificate";
import { AppContext } from "@/service/context";
import renderPDF from "@/utils/renderPDF";
interface GradeFormProps {
  courseId: string;
  onSave: (course: any)=> void
}

function GradeForm({ courseId, onSave }: GradeFormProps) {

  const [certificate, setCertificate] = useState<File | null>(null);
  const [recipientsFile, setRecipientsFile] = useState<File | null>(null);
  const [certificateURL, setCertificateURL] = useState<string | null>(null);
  const [certificateIframeUrl, setCertificateIframeUrl] = useState<string | null>(null);
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
  const iframeRef = useRef<HTMLDivElement>(null);
  const [selectedFontSize, setSelectedFontSize] = useState<number>(16);
  const [certificateDemo, setCertificateDemo] = useState<any>(null);
  const [hasPreviewed, setHasPreviewed] = useState<any>(false);
  const { setConfig, config } = React.use(AppContext);

  const handleFontSizeChange = (size: number) => {
    setSelectedFontSize(size);
    handleBlur()

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
      const inframe = document.getElementById("certificate-upload-popup-iframe")
      console.log((boxRef?.current?.clientHeight || 0), boxRef, 'popopo')
      let addY = (boxRef?.current?.clientHeight || 0)
      addY =  addY/1.5 || 0
      
      const certificateDetails = {
        course: courseId,
        fontSize: selectedFontSize,
        fontFamily: selectedFont,
        position: {
          x: box.x,
          y: box.y + addY,
          frameWidth: (iframeRef?.current || inframe)?.clientWidth || 0,
          frameHeight: (iframeRef?.current || inframe)?.clientHeight || 0,
        },
        certificateFile: certificateFileURL,
      };
      setCertificateDemo(certificateDetails)
      const { data } = await customFetch("/certificates", {
        method: "POST",
        body: JSON.stringify(certificateDetails),
      });

      console.log("Certificate details saved successfully:", data);
      setCertificateId(data._id);
      toast.success("Certificate details saved successfully");
      return certificateDetails
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
      setConfig({ fileChanged: false })
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error saving course");
    }
  };

  const handleAddBox = (e: React.MouseEvent<HTMLDivElement>) => {
    if (box) return;

    console.log('setup box', { box })
    const containerRect = e.currentTarget.getBoundingClientRect();
    const boxWidth = 400;
    const boxHeight = 50;
    // const x = e.clientX - containerRect.left - boxWidth / 2;
    // const y = e.clientY - containerRect.top - boxHeight / 2;
    const newX = e.clientX - containerRect.left
    const newY = e.clientY - containerRect.top
    const x = Math.max(0, Math.min(newX, containerRect.width - boxWidth));
    const y = Math.max(0, Math.min(newY, containerRect.height - boxHeight));

    setBox({ x, y, text: certificateTextTitle, width: boxWidth, height: boxHeight });
  };

  const handleTextChange = (text: string) => {
    setBox((prev) => (prev ? { ...prev, text } : null));
    handleBlur()
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    handleBlur()
  };

  const handleDragStart = (e: React.MouseEvent, corner: string, boxRefs?: any) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;

    const initialX = box?.x ?? 0;
    const initialY = box?.y ?? 0;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      console.log(
        dx, moveEvent.clientX, startX,
        '0987654567890',
         dy, moveEvent.clientY, startY
        )


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
      boxRef.current = boxRefs.current
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
    setConfig({ loading: true })

   await saveCertificateDetails();
    setPopupVisible(false);
    router.refresh();
    setConfig({ loading: false })
  };

  const onPreview = async ()=>{
    setCertificateIframeUrl(null)
    if (hasPreviewed){
      setHasPreviewed(false)
      setBox(null)
      return
    }
    toast.error(`Please wait, generating preview.`)
    const data = await saveCertificateDetails();

    if (!data){
      toast.error(`Please select a certificate.`)
      return
    }
    const vl = await renderPDF(data?.certificateFile, {
      ...(data || {}),
      certificate: data,
      recipient: { name: "John Dawn" }
    })
    setCertificateIframeUrl(vl)
    setHasPreviewed(true)
  }

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

  useEffect(() => {
    setConfig({ loading: false })
    return () => {
      setConfig({ loading: false })   
     };
  }, []);

  console.log(iframeRef)
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
          disabled={config?.loading || !config?.fileChanged}
          loading={config?.loading}
        >
          Save Changes
        </Button>

        {popupVisible && certificateURL && (
          <CertificateUploadPopup
          handleFileChange={handleFileChange('certificate')}
            certificateURL={certificateIframeUrl || certificateURL}
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
            iframeRef={iframeRef}
            onPreview={onPreview}
hasPreviewed={hasPreviewed}

pdfStyle={{}}
pdfContainerStyle={{}}
            />
        )}
      </form>
    </div>
  );
}

export default GradeForm;

