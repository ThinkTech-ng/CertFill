"use client";

import Image from "next/image";
import thinktech from "@/public/thinktechLogo.svg";
import cert from "@/public/images/certImage.svg";
import logo from "@/public/certLogoWithText.svg";
import React from "react";
import { layoutAsideDescription } from "./data";
import { cn } from "@/utils/utils";

interface AppLayoutProps extends React.PropsWithChildren {
    description?: string
}
export const AppLayout: React.FC<AppLayoutProps> = (props) => {
  return (
    <div className={cn("sm:h-screen overflow-hidden min-h-[700px] flex flex-col sm:flex-row", 'font-generalSans')}>
      <div className="font-generalSans sm:h-full w-full sm:w-1/2 max-w-[735px] justify-between flex flex-col max-sm:flex-col-reverse lg:min-w-[500px] bg-colors-certFillBlue p-10 sm:p-20 text-white">
        <div className="flex flex-row items-center gap-6 max-sm:gap-4 max-sm:mx-auto">
          <span className="font-ttNorms font-bold uppercase tracking-[2.5px] text-[9px] max-sm:text-[5.7px]">
            Powered by
          </span>
          <Image sizes="" src={thinktech} alt="logo of thinktech" />
        </div>
        <div className="py-8 ">
          <Image src={cert} alt="certificate" width={400} />
        </div>
        <div>
          <div>
            <Image src={logo} className="w-32 h-10 max-sm:mx-auto" alt="certificate" />
          </div>
          <div className="text-xs sm:text-xl pt-6 font-generalSans max-sm:text-center max-sm:leading-5">
            {props.description || layoutAsideDescription}
          </div>
        </div>
      </div>
      <div className="sm:h-full overflow-auto grow bg-white py-15 px-2 sm:p-20 text-black">
      <div className=" flex flex-col justify-between w-full h-full max-w-[600px] m-auto">
        {props.children}
      </div>
      </div>
    </div>
  );
}

export default  AppLayout