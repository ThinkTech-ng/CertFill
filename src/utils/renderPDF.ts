import { certificatePDFFontSizeWidth } from "@/store/certificate";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import { toast } from "sonner";
import { fetchFont } from "./handlePDF";

export default async function renderPDF(pdfUrl: string, certificate: any) {
    try {

      function percentOfFrame(n: number, frameSize: number) {
        return (n / frameSize) * 100;
      }
      function calculatePercent(n: number, value: number) {
        return (n / 100) * value;
      }

      const pdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(pdfBytes);
      pdfDoc.registerFontkit(fontkit);

      const page = pdfDoc.getPage(0);
      const pdfWidth = page.getWidth();
      const pdfHeight = page.getHeight();
      const frameWidth = certificate.certificate.position.frameWidth;
      const frameHeight = certificate.certificate.position.frameHeight;
      const x = certificate.certificate.position.x;
      const y = certificate.certificate.position.y - certificatePDFFontSizeWidth[certificate.certificate.fontSize];

      const newX = calculatePercent(percentOfFrame(x, frameWidth), pdfWidth);
      const newY = calculatePercent(percentOfFrame(y, frameHeight), pdfHeight);

      console.log(
        certificatePDFFontSizeWidth[certificate.certificate.fontSize],'certificatePDFFontSizeWidth[certificate.certificate.fontSize]'
      )
      console.log(
        certificate.certificate.fontSize,'[certificate.certificate.fontSize]'
      )
      const textData = {
        x: newX || certificate.certificate.position.x,
        y: newY || certificate.certificate.position.y,
        label: certificate.recipient.name,
      };

      const xFinal = (textData.x / frameWidth) * pdfWidth;
      const yFinal = pdfHeight - (textData.y / frameHeight) * pdfHeight;
      const fontBytes = await fetchFont(certificate.certificate.fontFamily);
      const font = await pdfDoc.embedFont(fontBytes);

      console.table(
        {...textData,pdfWidth,
            pdfHeight, xFinal,
            yFinal, frameWidth,
            frameHeight}
      )
      page.drawText(textData.label, {
        x: xFinal,
        y: yFinal,// + 20, // add 20 because it always removes around 15 to 30 px extra because of the frame calculation
        font,
        size:
          certificate.certificate.fontSize,
          //  +
          // certificate.certificate.fontSize / 7,
        color: rgb(0, 0, 0),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const pdfUrlBlob = URL.createObjectURL(pdfBlob);

    //   let iframe = document.getElementById("recipient-certificate-iframe") as HTMLIFrameElement;
    //   if (!iframe) {
    //     throw "Invalid";
    //   }
    //   iframe.src = pdfUrlBlob + "#toolbar=0";
      return (pdfUrlBlob as string);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error((error as Error)?.message || 'Error Loading certificate')
    }
  }