'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  completeRecipientPayment,
  fetchCertificate,
  generateRecipientPayment,
} from '@/service/programs';
import { LoadingAtom } from '@/components/atom/loading';
import { CertificateNotFound } from './not-found';
import { Button } from '@/components/molecule/button';
import { formatToCurrency } from '@/utils/utils';
import { toast } from 'sonner';
import PaystackPop from '@paystack/inline-js';
import Konva from 'konva';

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
      if (code === 'PAYMENT_SUCCESSFUL') {
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
      if (code === 'PROGRAM_SUCCESSFUL' && data.shortcode?.startsWith('CFR.')) {
        router.push(`/cert/${data.shortcode}`);
        return;
      }
      if (code === 'PAYMENT_REQUIRED' && data.pay) {
        try {
          const popup = new PaystackPop();
          await popup.checkout({
            ...data.pay,
            onSuccess(tranx) {
              finalize.mutate(tranx);
            },
            onError(error) {
              if (error?.message?.toLowerCase()?.includes('duplicate')) {
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
      throw 'Please upload all required documents.';
    },
  });
  const isFreePaid =
    (props?.program?.programs?.paymentPlan === 'issuer' &&
      props?.program?.programs?.paymentComplete) ||
    props.program?.user?.hasCompleted;
  const text = isFreePaid
    ? 'Download Certificate'
    : `Pay ₦${formatToCurrency(props?.program?.programs?.price || '') || ''} to download`;
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
  const printRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewReady, setViewReady] = useState<boolean>(false);
  const [certImage, setCertImage] = useState<string>(null);

  const { data: { data: certificate } = {}, isLoading } = useQuery<any>({
    queryKey: ['certificate-'],
    queryFn: async () => await fetchCertificate({ id }),
  });

  const previewText = 'Certfill Preview Copy';

  useEffect(() => {
    if (certificate?.certificate?.canvasData) {
      const cert = certificate?.certificate;

      const stageNode = Konva.Node.create(cert?.canvasData, containerRef.current);

      stageNode.find('Text').forEach((textNode: any) => {
        textNode.text(certificate?.recipient?.name);
        textNode.draggable(false);

        if (cert?.alignment.toLowerCase() !== 'left') {
          // Center the text horizontally on the stage
          const stage = textNode.getStage();
          if (stage) {
            textNode.x(stage.width() / 2);
            textNode.offsetX(textNode.width() / 2); // Adjust anchor point for proper centering
          }
        }
      });

      // Add watermark text if this is a preview
      if (!isFree) {
        stageNode.find('Layer').forEach((layerNode: any) => {
          const watermarkText = new Konva.Text({
            text: previewText,
            fontSize: 80,
            fontFamily: 'Arial',
            fill: 'rgba(210, 17, 17, 0.5)',
            x: layerNode.width() / 2,
            y: layerNode.height() / 2,
            rotation: -40,
            draggable: false,
          });

          // Center the text
          watermarkText.offsetX(watermarkText.width() / 2);
          watermarkText.offsetY(watermarkText.height() / 2);

          // Add to stage
          layerNode.add(watermarkText);
          layerNode.batchDraw();
        });
      }

      // Manually fix images (Konva does not restore them from JSON)
      stageNode.find('Image').forEach((imageNode: any) => {
        const img = new window.Image();
        img.src = cert?.certificateFile; // Ensure src is stored in JSON
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageNode.image(img);
          stageNode.batchDraw(); // Re-render stage after images load

          const imageData = stageNode.toDataURL({ pixelRatio: 2 });
          setCertImage(imageData);
          setViewReady(true);
        };
      });
    }
  }, [certificate]);

  if (isLoading && !certificate) {
    return <LoadingAtom />;
  }

  if (!certificate && !isLoading) {
    return <CertificateNotFound />;
  }

  const handleDownloadImage = async () => {
    const response = await fetch(certImage);
    const imageBytes = await response.arrayBuffer();
    const blob = new Blob([imageBytes], { type: 'image/jpeg' });
    saveAs(blob, 'certificate.jpg');
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(certImage);
      const imageBytes = await response.arrayBuffer();

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      const pngImage = await pdfDoc.embedPng(imageBytes);
      const { width, height } = pngImage.size();

      // Resize image to fit page if needed
      const pdfWidth = page.getWidth();
      const scale = pdfWidth / width;
      const scaledWidth = width * scale;
      const scaledHeight = height * scale;

      page.drawImage(pngImage, {
        x: 0,
        y: page.getHeight() - scaledHeight, // y=0 is bottom, so flip
        width: scaledWidth,
        height: scaledHeight,
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, (props.filename || 'Certificate') + '.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="h-full w-full">
      <div id="canvas" ref={containerRef} className="hidden" />
      <div
        className="mt-20 mx-auto h-[400px] max-w-[99%] w-[527px] relative pdf-container"
        ref={printRef}
      >
        {!viewReady && <LoadingAtom />}
        {certImage && <img src={certImage} alt="Certificate" />}
      </div>

      <div className="mt-6 flex justify-center relative z-50" style={{ zIndex: 120222 }}>
        <Button
          loading={props.loading}
          disabled={props.disabled}
          className="font-semibold w-full h-[46px] text-base"
          onClick={onDownload(handleDownloadImage)}
        >
          {downloadBtnText}
        </Button>
      </div>
    </div>
  );
}

export default CertificateContent;
