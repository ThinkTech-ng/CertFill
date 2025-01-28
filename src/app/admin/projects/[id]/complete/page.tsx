"use client"
import Image from "next/image";
import { Copy } from 'lucide-react';
import ribbon from "@/public/certRibbon.svg"
import { useParams } from "next/navigation";
import { copyToClipboard } from "@/utils/copy";
import { AppContext } from "@/service/context";
import React from "react";
import { LoadingAtom } from "@/components/atom/loading";
import { Button } from "@/components/molecule/button";
import Link from "next/link";

export default function CompleteCourseSetup(){
    const { id } = useParams(); 
  const app = React.useContext(AppContext)
    if (!app.user?.user) {
        return <LoadingAtom />
    }
    if (!app.user?.user?.username){
        return (
            <div>
                <p className="text-red-500">Error: {"You have not completed your profile"}</p>
                <Link href={'/admin/profile'}>
                <Button>Go to profile</Button>
                </Link>
            </div>
        )
    }
    const baseUrl = window.location.origin
    const url = `${baseUrl}/${app.user?.user?.username}/${id}`
    return (
    <div className="h-full w-full flex flex-col items-center justify-center">
          <Image src={ribbon} className=" h-[200px] max-sm:mx-auto" alt="certificate" />

    <h3 className="text-[32px] font-semibold text-center">Success! </h3>

    <p className="text-center py-3">Your Certificate is Ready to Send</p>

    <div className="bg-[#F1FDFF] flex items-center justify-between px-4 py-2 rounded-sm text-base">
        <div className="pr-3">

            
        <span className="font-semibold">Certificate Link:</span>
        <span> {url}</span></div>

        <Copy onClick={()=> copyToClipboard(url)} size={25} className="text-primary cursor-pointer" />
    </div>
    </div>)
}