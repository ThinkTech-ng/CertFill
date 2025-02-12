"use client"
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { Input } from "@/components/molecule/input";
import { Button } from "@/components/molecule/button";

export default function CertificateFiller() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [name, setName] = useState("");
  const canvasRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedTemplate(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateCertificate = () => {
    if (!selectedTemplate) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = selectedTemplate;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.font = "40px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(name, canvas.width / 2, canvas.height / 2);
      
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("certificate.pdf");
    };
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Certificate Filler</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-4" />
      <Input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={generateCertificate} disabled={!selectedTemplate}>Generate Certificate</Button>
      <canvas ref={canvasRef} className="border mt-4 hidden"></canvas>
    </div>
  );
}
