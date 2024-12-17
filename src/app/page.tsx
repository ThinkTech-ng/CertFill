"use client";

import Image from "next/image";
import thinktech from "@/public/thinktechLogo.svg";
import cert from "@/public/images/certImage.svg";
import logo from "@/public/certLogo.svg";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden min-h-[700px] flex flex-row ">
      <div className="font-generalSans h-full w-1/2 max-w-[735px] justify-between flex  flex-col lg:min-w-[500px] bg-colors-certFillBlue p-20 text-white">
        <div className="flex flex-row items-center gap-6">
          <span className="font-ttNorms font-bold uppercase tracking-[2.5px] text-[9px]">
            Powered by
          </span>
          <Image src={thinktech} alt="logo of thinktech" />
        </div>
        <div className="py-8 ">
          <Image src={cert} alt="certificate" width={400} />
        </div>
        <div>
          <div>
            <Image src={logo} alt="certificate" />
          </div>
          <div className="text-xl pt-6">
            CertFill simplifies certificate creation and management, ensuring
            fast, accurate, and seamless processing for all your certification
            needs.
          </div>
        </div>
      </div>
      <div className="h-full grow bg-white p-20 text-black flex flex-col justify-between ">
        <span className="text-3xl">Welcome User!</span>
      </div>
    </div>
  );
}
