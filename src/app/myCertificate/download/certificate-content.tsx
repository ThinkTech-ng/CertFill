/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

function CertificateContent() {
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [certificate, setCertificate] = useState<any>(null);

  const searchParams = useSearchParams();
  const programId = searchParams.get("programId");
  const courseId = searchParams.get("courseId");
  const email = searchParams.get("email");

  useEffect(() => {
    if (programId && courseId && email) {
      fetchCertificate(courseId, email);
    }
  }, [programId, courseId, email]);

  const fetchCertificate = async (courseId: string, email: string) => {
    try {
      const response = await fetch(
        `https://certfillapi.reckonio.com/api/certificates/certificates/${courseId}?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get certificate");
      }

      const data = await response.json();
      setCertificate(data);
    } catch (error) {
      console.error("Error getting certificate:", error);
    }
  };

  const generatePDF = () => {
    if (certificate) {
      const doc = new jsPDF();

      // Add certificate content to the PDF
      const certificateFile = certificate.certificate.certificateFile;
      if (certificateFile) {
        doc.addImage(certificateFile, "JPEG", 10, 10, 180, 160); // Add image
      }

      // Save the generated PDF
      doc.save("certificate.pdf");
    }
  };

  if (!certificate) {
    return <p>Loading certificate...</p>;
  }

  return (
    <div className="h-full w-full">
      <h1 className="text-center py-5 text-2xl">
        This is your certificate shown below
      </h1>
      <div className="mt-20 mx-auto h-[373px] w-[527px] relative pdf-container">
        <iframe
          src={`${certificate.certificate.certificateFile}#toolbar=0`}
          className="w-full h-full overflow-hidden"
          title="Certificate"
          onLoad={() => setPdfLoaded(true)}
        ></iframe>
        {pdfLoaded && (
          <div
            className="certificate-box p-2 border-2 border-transparent z-20 h-full w-full absolute text-center"
            style={{
              top: certificate.certificate.position.y,
              left: certificate.certificate.position.x,
              width: 450,
              height: 50,
              fontSize: certificate.certificate.fontSize,
              fontFamily: certificate.certificate.fontFamily,
              color: "black",
            }}
          >
            {certificate.recipient.name}
          </div>
        )}
      </div>

      {/* Button to generate PDF */}
      {/* <button
        onClick={generatePDF}
        className="mt-5 p-2 bg-blue-500 text-white rounded"
      >
        Download Certificate as PDF
      </button> */}
    </div>
  );
}

export default CertificateContent;
