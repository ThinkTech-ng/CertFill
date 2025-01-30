import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const fetchPdf = async (pdfUrl) => {
  const response = await fetch(pdfUrl);
  if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  return response.arrayBuffer();
};

export const fetchFont = async (fontFamily) => {
  const fontUrl = `/fonts/${fontFamily}/bold.ttf`;
  const response = await fetch(fontUrl);
  if (!response.ok) throw new Error(`Failed to fetch font: ${response.statusText}`);
  
  const fontBytes = await response.arrayBuffer();
  if (fontBytes.byteLength === 0) throw new Error("Font file is empty!");
  
  return fontBytes;
};

const addTextToPdf = (pdfDoc, font, recipientName, fontSize, position, isFree, previewText) => {
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width: pageWidth, height: pageHeight } = firstPage.getSize();

  // Add watermark for unpaid certificates
  if (!isFree) {
    firstPage.drawText(previewText, {
      x: 0,
      y: pageHeight - 100,
      size: 80,
      color: rgb(0.8, 0.8, 0.8),
      rotate: { type: "degrees", angle: -55 },
    });
  }

  // Add recipient name
  const recipientTextWidth = font.widthOfTextAtSize(recipientName, fontSize);
  const recipientX = (pageWidth - recipientTextWidth) / 2;
  const recipientY = (pageHeight / 1.29) - position.y;

  firstPage.drawText(recipientName, {
    x: recipientX,
    y: recipientY - 17, // Adjusted Y position
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
};

export const generateCertificatePdf = async (certificate, isFree, previewText) => {
  try {
    const { certificateFile, fontFamily, fontSize, position, recipient } = certificate;
    const pdfBytes = await fetchPdf(certificateFile);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const fontBytes = await fetchFont(fontFamily);
    const font = await pdfDoc.embedFont(fontBytes);

    addTextToPdf(pdfDoc, font, recipient.name, fontSize, position, isFree, previewText);

    const finalPdfBytes = await pdfDoc.save();
    return new Blob([finalPdfBytes], { type: "application/pdf" });
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

export const renderPDF = async (pdfUrl, certificate) => {
  try {
    const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.getPage(0);
    const fontBytes = await fetchFont(certificate.certificate.fontFamily);
    const font = await pdfDoc.embedFont(fontBytes);

    page.drawText(certificate.recipient.name, {
      x: certificate.certificate.position.x,
      y: certificate.certificate.position.y,
      font,
      size: certificate.certificate.fontSize,
      color: rgb(0, 0, 0),
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
    const pdfUrlBlob = URL.createObjectURL(pdfBlob);
    return pdfUrlBlob
  } catch (error) {
    console.error("Error loading PDF:", error);
    return null
  }
};