import Image from "next/image";
import logo from "@/public/certLogo.svg";
import Form from "./create";

export default function Projects() {
  return (
    <div className="h-screen overflow-hidden min-h-[700px] flex flex-row font-generalSans">
      <div className="font-generalSans h-full w-1/2 max-w-[735px] justify-between flex  flex-col lg:min-w-[500px] bg-certFillBlue p-20 text-white">
        <Link href='/admin'>
          <Image src={logo} alt="certificate" />
        </Link>
        <div className="text-5xl pt-6 font-semibold flex flex-col">
          <span>Simplifying Certs,</span>
          <span>One Click at a Time</span>
        </div>
      </div>
      <div className="h-full grow bg-white p-20 text-black flex flex-col justify-between ">
        <span className="text-2xl">Create your Projects</span>
        <div className="w-full flex flex-col min-h-60 justify-between">
          <Form />
        </div>
      </div>
    </div>
  );
}
