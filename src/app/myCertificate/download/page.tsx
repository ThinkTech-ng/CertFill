"use client";

import React, { Suspense } from "react";
import CertificateContent from "./certificate-content";

function CertificatePage() {
  return (
    <div className="h-screen">
      <Suspense fallback={<p>Loading certificate...</p>}>
        <CertificateContent />
      </Suspense>
    </div>
  );
}

export default CertificatePage;
