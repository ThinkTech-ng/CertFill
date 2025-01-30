"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as PDFJs from "pdfjs-dist";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  completeRecipientPayment,
  fetchCertificate,
  generateRecipientPayment,
} from "@/service/programs";
import { LoadingAtom } from "@/components/atom/loading";
import { CertificateNotFound } from "./not-found";
import { Button } from "@/components/molecule/button";
import { formatToCurrency } from "@/utils/utils";
import { fetchFont } from "@/utils/handlePDF";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { certificatePDFFontSizeWidth } from "@/store/certificate";

GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

interface PaidCertificateProps {
  program: {
    user: any;
    course: Record<string, any>;
    programs: Record<string, any>;
  };
}
export const PaidCertificate: React.FC<PaidCertificateProps> = (props) => {
  const router = useRouter();

  const finalize = useMutation({
    mutationFn: completeRecipientPayment,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: async ({ data, code }, v, con) => {
      if (code === "PAYMENT_SUCCESSFUL") {
        router.push(`/cert/${data.shortcode}`);
      } else {
        finalize.reset();
      }
    },
  });
  const mutation = useMutation({
    mutationFn: generateRecipientPayment,
    onError(error) {
      toast.error(error.message);
    },
    onSuccess: async ({ data, code }) => {
      if (code === "PROGRAM_SUCCESSFUL" && data.shortcode?.startsWith("CFR.")) {
        router.push(`/cert/${data.shortcode}`);
        return;
      }
      if (code === "PAYMENT_REQUIRED" && data.pay) {
        try {
          const popup = new PaystackPop();
          await popup.checkout({
            ...data.pay,
            onSuccess(tranx) {
              finalize.mutate(tranx);
            },
            onError(error) {
              if (error?.message?.toLowerCase()?.includes("duplicate")) {
                console.log(data);
                finalize.mutate(data.pay);
                return;
              }
              toast.error(error.message);
            },
          });
        } catch (e) {
          // TODO: track analytic
          toast.error((e as Error)?.message || 'Could not complate payment')
        }
        return;
      }
      throw "Please upload all required documents.";
    },
  });
  const isFreePaid =
    (props?.program?.programs?.paymentPlan === "issuer" &&
      props?.program?.programs?.paymentComplete) ||
    props.program?.user?.hasCompleted;
  const text = isFreePaid
    ? "Download Certificate"
    : `Pay ₦${
        formatToCurrency(props?.program?.programs?.price || "") || ""
      } to download`;
  const onDownload = (action: any) => () => {
    if (!isFreePaid) {
      mutation.mutate({ id: props?.program?.user._id });
      return;
    }
    action();
  };
  return (
    <>
      <CertificateContent
        filename={`${props?.program?.course?.name} ${props?.program?.programs.name} certificate`}
        isFree={isFreePaid}
        onDownload={onDownload}
        downloadBtnText={text}
        id={props?.program?.user._id}
        loading={mutation.isPending || finalize.isPending}
        disabled={mutation.isPending || finalize.isPending}
      />
    </>
  );
};

function CertificateContent({
  id,
  downloadBtnText,
  isFree,
  onDownload,
  ...props
}: {
  id: string;
  isFree?: boolean;
  downloadBtnText: string;
  onDownload: (cb: () => {}) => () => void;
  [key: string]: any;
}) {
  const printRef = React.useRef(null);
  const canvaRef = React.useRef(null);
  const [dowloadableUrlBlob, setDownloadable] = React.useState<string | null>(null);

  const { data: { data: certificate } = {}, isLoading } = useQuery<any>({
    queryFn: async () => await fetchCertificate({ id }),
    queryKey: [],
  });

  const previewText = "Certfill Preview Copy";

  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  async function renderPDF(pdfUrl: string) {
    try {

      console.log(certificate);
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

      const textData = {
        x: newX || certificate.certificate.position.x,
        y: newY || certificate.certificate.position.y,
        label: certificate.recipient.name,
      };

      const xFinal = (textData.x / frameWidth) * pdfWidth;
      const yFinal = pdfHeight - (textData.y / frameHeight) * pdfHeight;
      const fontBytes = await fetchFont(certificate.certificate.fontFamily);
      const font = await pdfDoc.embedFont(fontBytes);

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

      let iframe = document.getElementById("recipient-certificate-iframe") as HTMLIFrameElement;
      if (!iframe) {
        throw "Invalid";
      }
      iframe.src = pdfUrlBlob + "#toolbar=0";
      setDownloadable(pdfUrlBlob as string);
    } catch (error) {
      console.error("Error loading PDF:", error);
      toast.error((error as Error)?.message || 'Error Loading certificate')
    }
  }

  React.useEffect(() => {
    if (certificate?.certificate?.certificateFile) {
      renderPDF(certificate?.certificate?.certificateFile);
      return;
    }
  }, [certificate?.certificate?.certificateFile]);

  if (isLoading && !certificate) {
    return <LoadingAtom />;
  }

  if (!certificate && !isLoading) {
    return <CertificateNotFound />;
  }

  const handleDownloadPdf = async () => {
    if (!dowloadableUrlBlob) return;
    window.open(dowloadableUrlBlob, "_blank");
  };

  return (
    <div className="h-full w-full">
      <div
        className="mt-20 mx-auto h-[400px] max-w-[99%] w-[527px] relative pdf-container"
        ref={printRef}
      >
        <div className="overflow-hidden h-[373px] w-[527px] relative pdf-container">
          <iframe
            className="w-full h-full border-0 "
            title="PDF Preview"
            id="recipient-certificate-iframe"
          ></iframe>
        </div>

        {!pdfLoaded && <LoadingAtom />}
        {pdfLoaded && (
          <>
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
            {!isFree && (
              <div
                className="certificate-box p-2 border-2 border-transparent z-20 h-full w-full absolute text-center"
                style={{
                  top: 50,
                  left: 50,
                  right: 0,
                  color: `rgb(196, 189, 189)`,
                  zIndex: 567,
                  transform: "rotate(-45deg)",
                  fontSize: "4.5rem",
                  fontWeight: "900",
                }}
              >
                {previewText}
              </div>
            )}
          </>
        )}
      </div>

      <div
        className="mt-6 flex justify-center relative z-50"
        style={{ zIndex: 120222 }}
      >
        <Button
          loading={props.loading}
          disabled={props.disabled}
          className="font-semibold w-full h-[46px] text-base"
          onClick={onDownload(handleDownloadPdf)}
        >
          {downloadBtnText}
        </Button>
      </div>
    </div>
  );
}

export default CertificateContent;
