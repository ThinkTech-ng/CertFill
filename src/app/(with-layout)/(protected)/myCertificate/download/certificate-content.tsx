/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function CertificateContent() {
  const printRef = React.useRef(null);

  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [certificate, setCertificate] = useState<any>(null);

  const searchParams = useSearchParams();
  const programId = searchParams.get('programId');
  const courseId = searchParams.get('courseId');
  const email = searchParams.get('email');

  useEffect(() => {
    if (programId && courseId && email) {
      fetchCertificate(courseId, email);
    }
  }, [programId, courseId, email]);

  const fetchCertificate = async (courseId: string, email: string) => {
    try {
      const response = await fetch(
        `https://certfillapi.reckonio.com/api/certificates/certificates/${courseId}?email=${encodeURIComponent(
          email,
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to get certificate');
      }

      const data = await response.json();
      console.log(data);
      setCertificate(data);
    } catch (error) {
      console.error('Error getting certificate:', error);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      // Fetch the certificate PDF
      const response = await fetch(certificate.certificate.certificateFile);
      const existingPdfBytes = await response.arrayBuffer();

      // Load the PDF
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Embed a font for measuring text width
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Add a new page or modify an existing one
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      // Dynamic positioning
      const text = 'Benjamin Adeboye Ihunnaya';
      const fontSize = certificate.certificate.fontSize || 16;

      // Measure the text width
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      // Center the text
      const x = (pageWidth - textWidth) / 2; // Calculate x for center alignment
      const y_pdf_lib = pageHeight - certificate.certificate.position.y;

      // Draw recipient's name
      firstPage.drawText(text, {
        x,
        y: y_pdf_lib - 17, // Convert y-coordinate
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Create a Blob and download using file-saver
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'certificate.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (!certificate) {
    return <p>Loading certificate...</p>;
  }

  return (
    <div className="h-full w-full">
      <h1 className="text-center py-5 text-2xl">This is your certificate shown below</h1>
      <div className="mt-20 mx-auto h-[373px] w-[527px] relative pdf-container" ref={printRef}>
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
              color: 'black',
            }}
          >
            {certificate.recipient.name}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownloadPdf}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default CertificateContent;
