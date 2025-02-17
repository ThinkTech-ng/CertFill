"use client";
import React, { useState, useEffect } from "react";

const TermsAndConditions = () => {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    setLastUpdated("7th October, 2024");
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">
        Terms and Conditions for Certfill
      </h1>
      <p className="mb-4 text-gray-600">Effective Date: {lastUpdated}</p>

      <h2 className="text-xl font-semibold mb-2">Table of Contents</h2>
      <ul className="list-disc ml-5 mb-6">
        <li>
          <a href="#definitions" className="text-blue-500 hover:underline">
            Definitions
          </a>
        </li>
        <li>
          <a href="#use" className="text-blue-500 hover:underline">
            Use of Services
          </a>
        </li>
        <li>
          <a href="#responsibilities" className="text-blue-500 hover:underline">
            User Responsibilities
          </a>
        </li>
        <li>
          <a href="#privacy" className="text-blue-500 hover:underline">
            Data Privacy
          </a>
        </li>
        <li>
          <a href="#property" className="text-blue-500 hover:underline">
            Intellectual Property
          </a>
        </li>
        <li>
          <a href="#liability" className="text-blue-500 hover:underline">
            Limitation of Liability
          </a>
        </li>
        <li>
          <a href="#termination" className="text-blue-500 hover:underline">
            Termination of Services
          </a>
        </li>
        <li>
          <a href="#changes" className="text-blue-500 hover:underline">
            Changes to Terms
          </a>
        </li>
        <li>
          <a href="#governing" className="text-blue-500 hover:underline">
            Governing Law
          </a>
        </li>
        <li>
          <a href="#contact" className="text-blue-500 hover:underline">
            Contact Information
          </a>
        </li>
      </ul>

      <h2 id="definitions" className="text-xl font-bold mb-2">
        1. Definitions
      </h2>
      <p className="mb-4">
        &quot;Certfill&quot; refers to our platform and services.
        &quot;User&quot; refers to any individual or organization using
        Certfill. &quot;Content&quot; refers to all data, documents, and
        materials uploaded to the platform.
      </p>

      <h2 id="use" className="text-xl font-bold mb-2">
        2. Use of Services
      </h2>
      <p className="mb-4">
        Certfill grants you a non-exclusive, non-transferable license to use the
        platform for lawful purposes. You agree not to misuse the platform or
        engage in activities that violate laws or harm others.
      </p>

      <h2 id="responsibilities" className="text-xl font-bold mb-2">
        3. User Responsibilities
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>You are responsible for the accuracy of all data entered.</li>
        <li>
          You must maintain the confidentiality of your account credentials.
        </li>
        <li>
          You agree not to upload harmful, illegal, or copyrighted content
          without permission.
        </li>
      </ul>

      <h2 id="privacy" className="text-xl font-bold mb-2">
        4. Data Privacy
      </h2>
      <p className="mb-4">
        Certfill values your privacy and processes data in accordance with our
        Privacy Policy. We comply with the Nigeria Data Protection Regulation
        (NDPR).
      </p>

      <h2 id="property" className="text-xl font-bold mb-2">
        5. Intellectual Property
      </h2>
      <p className="mb-4">
        Certfill owns all rights to the platform, including trademarks and
        content. Users retain ownership of their uploaded content but grant
        Certfill a license to use it for service delivery.
      </p>

      <h2 id="liability" className="text-xl font-bold mb-2">
        6. Limitation of Liability
      </h2>
      <p className="mb-4">
        Certfill is provided &quot;as is&quot; without warranties. We are not
        liable for losses due to user errors, unauthorized access, or
        interruptions in service.
      </p>

      <h2 id="termination" className="text-xl font-bold mb-2">
        7. Termination of Services
      </h2>
      <p className="mb-4">
        Certfill reserves the right to suspend or terminate access if users
        violate these terms. Users may discontinue using the service at any
        time.
      </p>

      <h2 id="changes" className="text-xl font-bold mb-2">
        8. Changes to Terms
      </h2>
      <p className="mb-4">
        Certfill may update these terms from time to time. Continued use of the
        platform constitutes acceptance of the updated terms.
      </p>

      <h2 id="governing" className="text-xl font-bold mb-2">
        9. Governing Law
      </h2>
      <p className="mb-4">
        These terms are governed by the laws of the Federal Republic of Nigeria.
      </p>

      <h2 id="contact" className="text-xl font-bold mb-2">
        10. Contact Information
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>
          Email:{" "}
          <a
            href="mailto:info@certfill.com"
            className="text-blue-500 hover:underline"
          >
            info@certfill.com
          </a>
        </li>
        <li>Phone: +234 9115083790</li>
        <li>Address: Lagos, Nigeria.</li>
      </ul>

      {/* <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Back to Top
      </button> */}
    </div>
  );
};

export default TermsAndConditions;
