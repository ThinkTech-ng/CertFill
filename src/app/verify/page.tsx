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
import { AppContext } from "@/service/context";

export default function VerifyUser() {
  const router = useRouter();
  const [email, , removeTempEmail] = useSessionStorage("temp-email", null);
  const { config, setConfig } = React.use(AppContext);

  const formSettings: FormField[] = [
    {
      type: "otp",
      name: "code",
      label: undefined,
      placeholder: "******",
      validation: z.string().length(6, "Enter a valid token"),
    },
  ];

  const handleSubmit =
    (formState: UseFormReturn) => async (data: Record<string, any>) => {
      try {
        setConfig({ loading: true })

        const response = await customFetch<{ message: string }>(
          `/auth/verify-email`,
          { method: "POST", body: JSON.stringify({ ...data, email }) }
        );
        toast.info(response?.message);
        removeTempEmail();
        router.replace("/verify-success");
      } catch (e) {
        const error = e as AuthError;
        if (error.message == "Validation failed") {
        setConfig({ loading: false })

          const { message, fields } = validateDynamicFormError(
            error.errors,
            formSettings
          );
          toast.error(message.join(", \n\t"));
          formState.control._setErrors(fields);
          return;
        }
        toast.error(error?.message);

        if (error.code === "EMAIL_VERIFIED") {
          removeTempEmail();
          router.replace("/verify-success");
          return
        }
        setConfig({ loading: false })

      }
    };
  const resendCode = async () => {
    try {
      setConfig({ loading: true })

        toast.info('Check your email for verification code.')
      const response = await customFetch<{
        message: string;
        status: AuthError["status"];
      }>(`/auth/resend-code`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      toast.info(response?.message);
      setConfig({ loading: false })
    } catch (e) {
      const error = e as AuthError;
      toast.error(error?.message);

      if (error.code === "EMAIL_VERIFIED") {
        removeTempEmail();
        router.replace("/verify-success");
        return
      }
      setConfig({ loading: false })

    }
  };

  React.useEffect(() => {
    router.prefetch("/verify-success");
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      if (!email) {
        router.replace("/?action=login");
      }
    }, 1000);
  }, []);
  return (
    <>
      <div className="text-center flex flex-col gap-5 py-10 px-5">
        <h3 className="text-3xl font-bold  text-neptuneSDream">
          Verify your email{" "}
        </h3>
        <p className="text-cloakGrey text-sm text-center font-light">
          We have sent a code to{" "}
          <strong className="block font-semibold">{email}</strong>
        </p>
        <DynamicForm
          onSubmit={handleSubmit}
          formSettings={formSettings}
          hideError
        >
          {(form) => (
            <>
              <div className="text-sm text-center text-tin -mt-4 py-4 sm:pb-44">
                Didn&#39;t receive any code? &nbsp;
                <span
                  onClick={() => {
                    form.setValue('code', '', { shouldValidate: true})
                    resendCode()
                }}
                  className="cursor-pointer underline hover:font-medium font-semibold text-neptuneSDream"
                >
                  Resend Code
                </span>
                .
              </div>

              <Button
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting || config?.loading}
                loading={form.formState.isSubmitting || config?.loading}
  
                className="w-full h-[46px] text-base  mt-4"
                
              >
                Verify
              </Button>
            </>
          )}
        </DynamicForm>
      </div>
    </>
  );
}
