"use client";
import * as z from "zod";

import Image from "next/image";
import thinktech from "@/public/thinktechLogo.svg";
import cert from "@/public/images/certImage.svg";
import logo from "@/public/certLogo.svg";
import AppLayout from "@/components/template/layout";
import DynamicForm from "@/components/organism/forms/dynamic";
import AuthForm from "@/components/template/layout/auth";
import { FormField } from "@/interface/form.dto";
import customFetch from "@/service/https";
import { toast } from "sonner";
import { AuthError } from "@/interface/error.dto";
import { validateDynamicFormError } from "@/utils/validationError";
import { UseFormReturn } from "react-hook-form";
import { User } from "@/interface/user.dto";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/molecule/button";
import Link from "next/link";
import { useSessionStorage } from "usehooks-ts";

export default function VerifyUser() {
  const router = useRouter();
  
  React.useEffect(() => {
    router.prefetch("/?action=login");
  }, []);
  return (
    <>
      <div className="text-center flex flex-col gap-5 justify-center items-center pt-10 px-5">
      <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M43.75 50L62.1376 60.8714C72.8575 67.2094 77.1425 67.2094 87.8625 60.8714L106.25 50" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M137.401 81.0975C137.533 74.9369 137.533 68.8131 137.401 62.6525C136.993 43.4929 136.789 33.9131 129.719 26.8166C122.649 19.7202 112.811 19.473 93.1325 18.9786C81.0044 18.6738 68.9956 18.6738 56.8676 18.9785C37.1896 19.4729 27.3505 19.7201 20.2809 26.8166C13.2114 33.913 13.0071 43.4928 12.5985 62.6525C12.4671 68.8131 12.4672 74.9369 12.5986 81.0975C13.0071 100.258 13.2114 109.837 20.281 116.934C27.3505 124.03 37.1896 124.277 56.8677 124.771C65.025 124.976 73.1281 125.044 81.25 124.973" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M115.625 87.5L117.237 91.8562C119.351 97.5687 120.408 100.425 122.491 102.509C124.575 104.592 127.431 105.649 133.144 107.763L137.5 109.375L133.144 110.987C127.431 113.101 124.575 114.158 122.491 116.241C120.408 118.325 119.351 121.181 117.237 126.894L115.625 131.25L114.013 126.894C111.899 121.181 110.842 118.325 108.759 116.241C106.675 114.158 103.819 113.101 98.1062 110.987L93.75 109.375L98.1062 107.763C103.819 105.649 106.675 104.592 108.759 102.509C110.842 100.425 111.899 97.5687 114.013 91.8562L115.625 87.5Z" fill="#00A2B9"/>
</svg>

        <h3 className="text-3xl font-bold  text-primary">
          Account verified
        </h3>
        <p className="text-cloakGrey text-sm text-center font-light">
          Your account has been verified successfully. Please login.
        </p>
        

      </div>
      <div className="py-10">

      <Button
      onClick={()=> router.replace('/?action=login')}
                type="button"
                className="w-full h-[46px] text-base"
              >
                Continue to Login
              </Button>
              
              </div>
    </>
  );
}
