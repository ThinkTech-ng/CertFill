'use client';
import React, { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated('7th October, 2024');
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy for Certfill</h1>
      <p className="mb-4 text-gray-600">Effective Date: {lastUpdated}</p>

      <h2 className="text-xl font-semibold mb-2">Table of Contents</h2>
      <ul className="list-disc ml-5 mb-6">
        <li>
          <a href="#info" className="text-blue-500 hover:underline">
            Information We Collect
          </a>
        </li>
        <li>
          <a href="#use" className="text-blue-500 hover:underline">
            How We Use Your Information
          </a>
        </li>
        <li>
          <a href="#security" className="text-blue-500 hover:underline">
            Data Protection and Security
          </a>
        </li>
        <li>
          <a href="#retention" className="text-blue-500 hover:underline">
            Data Retention
          </a>
        </li>
        <li>
          <a href="#sharing" className="text-blue-500 hover:underline">
            Sharing of Information
          </a>
        </li>
        <li>
          <a href="#rights" className="text-blue-500 hover:underline">
            Your Rights
          </a>
        </li>
        <li>
          <a href="#compliance" className="text-blue-500 hover:underline">
            Compliance
          </a>
        </li>
        <li>
          <a href="#changes" className="text-blue-500 hover:underline">
            Changes to Policy
          </a>
        </li>
        <li>
          <a href="#contact" className="text-blue-500 hover:underline">
            Contact Us
          </a>
        </li>
      </ul>

      <h2 id="info" className="text-xl font-bold mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>
          Personal Information: Name, email address, phone number, and other details required for
          certificate generation.
        </li>
        <li>Document Information: Data you input to create and download certificates.</li>
        <li>
          Usage Data: Information on how you interact with our platform to help us improve our
          services.
        </li>
      </ul>

      <h2 id="use" className="text-xl font-bold mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>To generate and deliver certificates.</li>
        <li>To provide customer support and respond to inquiries.</li>
        <li>To improve our services and enhance user experience.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 id="security" className="text-xl font-bold mb-2">
        3. Data Protection and Security
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>Encryption: All data is encrypted during storage and transmission.</li>
        <li>Secure Servers: We use secure servers and firewalls to prevent unauthorized access.</li>
        <li>Access Control: Only authorized personnel have access to your information.</li>
      </ul>

      <h2 id="retention" className="text-xl font-bold mb-2">
        4. Data Retention
      </h2>
      <p className="mb-4">
        We retain your data only as long as necessary for the purposes stated in this policy or as
        required by law. You may request the deletion of your data at any time.
      </p>

      <h2 id="sharing" className="text-xl font-bold mb-2">
        5. Sharing of Information
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>When required by law.</li>
        <li>
          With trusted service providers who assist us in operating our platform (under strict
          confidentiality agreements).
        </li>
      </ul>

      <h2 id="rights" className="text-xl font-bold mb-2">
        6. Your Rights
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>Access your personal information.</li>
        <li>Request corrections to your information.</li>
        <li>Request deletion of your data.</li>
        <li>Withdraw consent for data processing.</li>
      </ul>

      <h2 id="compliance" className="text-xl font-bold mb-2">
        7. Compliance with Nigerian Data Protection Laws
      </h2>
      <p className="mb-4">
        Certfill complies with the Nigeria Data Protection Regulation (NDPR) and other applicable
        laws to ensure the highest standards of data privacy and security.
      </p>

      <h2 id="changes" className="text-xl font-bold mb-2">
        8. Changes to this Privacy Policy
      </h2>
      <p className="mb-4">
        We may update this policy occasionally. We encourage you to review it regularly to stay
        informed about how we protect your information.
      </p>

      <h2 id="contact" className="text-xl font-bold mb-2">
        9. Contact Us
      </h2>
      <ul className="list-disc ml-5 mb-4">
        <li>
          Email:{' '}
          <a href="mailto:info@certfill.com" className="text-blue-500 hover:underline">
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

export default PrivacyPolicy;
