"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import { User } from "@/interface/user.dto";
import customFetch from "@/service/https";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { completeRecipientPayment, fetchCertificate, generateRecipientPayment } from "@/service/programs";
import { LoadingAtom } from "@/components/atom/loading";
import { CertificateNotFound } from "./not-found";
import { Button } from "@/components/molecule/button";
import { formatToCurrency } from "@/utils/utils";
import { toast } from "sonner";
import PaystackPop from "@paystack/inline-js";

interface PaidCertificateProps {
  program: {
    user: any;
    course: Record<string, any>;
    programs: Record<string, any>;
  };
}
export const PaidCertificate: React.FC<PaidCertificateProps> = (props) => {
  const router = useRouter()

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
        }
        return;
      }
      throw "Please upload all required documents.";
    },
  });
  const isFreePaid =(
    props?.program?.programs?.paymentPlan === "issuer" &&
    props?.program?.programs?.paymentComplete )|| props.program?.user?.hasCompleted;
  const text = isFreePaid
    ? "Download Certificate"
    : `Pay ₦${formatToCurrency(props?.program?.programs?.price || '') || ''} to download`;
  const onDownload = (action: any) => () => {
    if (!isFreePaid) {
      mutation.mutate({ id: props?.program?.user._id })
      return
    }
    console.log(isFreePaid, 'got here')
    action();
  };
  return (
    <>
      <CertificateContent
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
  [key:string]: any
}) {
  const printRef = React.useRef(null);

  const { data: { data: certificate } = {}, isLoading } = useQuery<any>({
    queryKey: ["certificate-"],
    queryFn: async () => await fetchCertificate({ id }),
  });

  const previewText = "Certfill Preview Copy";

  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);

  if (isLoading && !certificate) {
    return <LoadingAtom />;
  }

  if (!certificate && !isLoading) {
    return <CertificateNotFound />;
  }

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(certificate.certificate.certificateFile);
      const existingPdfBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width: pageWidth, height: pageHeight } = firstPage.getSize();

      if (!isFree) {
        const prevTextFontSize = 80;
        const prevTextWidth = font.widthOfTextAtSize(
          previewText,
          prevTextFontSize
        );

        const angle = -55;
        const prevTextX = 0;
        const prevTextY = pageHeight - 100;

        firstPage.drawText(previewText, {
          x: prevTextX,
          y: prevTextY,
          size: prevTextFontSize,
          color: rgb(0.8, 0.8, 0.8),
          rotate: { type: "degrees", angle },
        });
      }
      const recipientName = certificate.recipient.name;
      const recipientFontSize = certificate.certificate.fontSize || 16;
      const recipientTextWidth = font.widthOfTextAtSize(
        recipientName,
        recipientFontSize
      );

      const recipientX = (pageWidth - recipientTextWidth) / 2;
      const recipientY = pageHeight - certificate.certificate.position.y;

      firstPage.drawText(recipientName, {
        x: recipientX,
        y: recipientY - 17, // Adjusted Y position
        size: recipientFontSize,
        font,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "certificate.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="h-full w-full">
      <div
        className="mt-20 mx-auto h-[400px] max-w-[99%] w-[527px] relative pdf-container"
        ref={printRef}
      >
        <iframe
          src={`${certificate?.certificate?.certificateFile}#toolbar=0`}
          className="w-full h-full"
          title="Certificate"
          onLoad={() => setPdfLoaded(true)}
        ></iframe>
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

      <div className="mt-6 flex justify-center relative z-50" style={{ zIndex: 120222}}>
        <Button loading={props.loading} disabled={props.disabled} className="font-semibold w-full h-[46px] text-base" onClick={onDownload(handleDownloadPdf)}>
          {downloadBtnText}
        </Button>
      </div>
    </div>
  );
}

export default CertificateContent;
