"use client"
import Image from "next/image";
import { Copy } from 'lucide-react';
import ribbon from "@/public/certRibbon.svg"
import { useParams } from "next/navigation";
import { copyToClipboard } from "@/utils/copy";

export default function CompleteCourseSetup(){
    const { id } = useParams(); // Get the program ID from the URL

    const url = `https://certfill.com/i/${id}`
    return (<div className="h-full w-full flex flex-col items-center justify-center">
                    <Image src={ribbon} className=" h-[200px] max-sm:mx-auto" alt="certificate" />

    <h3 className="text-[32px] font-semibold text-center">Success! </h3>
    <p className="text-center py-3">Your Certificate is
    Ready to Send</p>

    <div className="bg-[#F1FDFF] flex items-center justify-between px-4 py-2 rounded-sm text-base">
        <div className="pr-3">
        <span className="font-semibold">Certificate Link:</span>
        {/* <span> certfill.com/tech4dev/dfa</span></div> */}
        <span> {url}</span></div>

        <Copy onClick={()=> copyToClipboard(url)} size={25} className="text-primary cursor-pointer" />
    </div>
    </div>)
}