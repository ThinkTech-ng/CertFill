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
import { User, LoginUser } from "@/interface/user.dto";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/molecule/button";
import Link from "next/link";
import { useSessionStorage } from "usehooks-ts";
import { TermAndCondition } from "@/components/atom/terms";
import { alphaNumericUnderscoreSchema } from "../../../../validators";
import { AppContext } from "@/service/context";

export default function UpdateUserProfile() {
  const router = useRouter();
  const app = React.useContext(AppContext)

  const formSettings: FormField[] = [
    {
      type: "text",
      name: "username",
      label: "Username",
      placeholder: "Username eg. kings_collage",
      validation: alphaNumericUnderscoreSchema.min(6, "Username but be atleast 6 characters"),
    },
    {
      type: "text",
      name: "email",
      label: "Email Address",
      validation: z.string().email(),
    },
    {
      type: "text",
      name: "phone",
      label: "Phone number",
      validation: z.string().min(9, "Enter a valid phone number. +234xxxxxxxx"),
    },
    {
      type: "text",
      name: "address",
      label: "Address",
      validation: z.string().min(6, "Specify a detailed address"),
    },
  ];

  const handleSubmit =
    (formState: UseFormReturn) => async (data: Record<string, any>) => {
      try {
        const response = await customFetch<{ message: string, data: LoginUser }>(
          `/users/update-profile`,
          { method: "POST", body: JSON.stringify({ ...data, email: undefined }) }
        );
        toast.info(response?.message);
        app.setUser(response.data as LoginUser);
        
        setTimeout(()=>{
          router.push("/admin");
        }, 4000)
      } catch (e) {
        const error = e as AuthError;
        if (error.message == "Validation failed") {
          const { message, fields } = validateDynamicFormError(
            error.errors,
            formSettings
          );
          toast.error(message.join(", \n\t"));
          formState.control._setErrors(fields);
          return;
        }
        toast.error(error?.message);
      }
    };

  React.useEffect(() => {
    router.prefetch("/admin");
  }, []);
  return (
    <>
      <div className="flex flex-col gap-5 py-10 px-5">
        <h3 className="text-3xl font-bold  text-black pb-10">
        Complete Details
        </h3>
        
        <DynamicForm
          onSubmit={handleSubmit}
          formSettings={formSettings}
          hideError
          defaultValues={app.user?.user || {}}
        >
          {(form) => (
            <>
            <TermAndCondition type={'register'} />

              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="w-full h-[46px] text-base  mt-4"
              >
                Save
              </Button>
            </>
          )}
        </DynamicForm>
      </div>
    </>
  );
}
