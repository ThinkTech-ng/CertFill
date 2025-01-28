import { Button } from "@/components/molecule/button"
import searchIcon from "@/public/icons/search.svg"
import Image from "next/image"
import React from "react"
interface CertificateNotFoundProps {
    onClick?: ()=> void
    text?: string | React.ReactNode
}
export const CertificateNotFound: React.FC<CertificateNotFoundProps> = (props)=>{
    return (<div className="h-full text-center gap-8 flex flex-col justify-center items-center">
        <Image src={searchIcon} alt="" />
        <h4 className="text-[32px] font-semibold">Certificate Not Found</h4>
        <p className="text-[24px] font-normal pb-5 max-w-[500px]">
            {props.text || `We couldn't locate your certificate. Please verify your details or contact the issuer for further assistance`}
        </p>
        {props.onClick && <Button onClick={props.onClick} className={"w-full max-w-[340px]"}>Go Back</Button>}
    </div>)
}