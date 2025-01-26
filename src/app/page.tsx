"use client";
import * as z from "zod";

import Image from "next/image";
import thinktech from "@/public/thinktechLogo.svg";
import cert from "@/public/images/certImage.svg";
import logo from "@/public/certLogo.svg";
import AppLayout from "@/components/template/layout";
import DynamicForm from "@/components/organism/forms/dynamic";
import AuthForm from "@/components/template/layout/auth";
import { AuthFormType, FormField } from "@/interface/form.dto";
import customFetch from "@/service/https";
import { toast } from "sonner";
import { AuthError } from "@/interface/error.dto";
import { validateDynamicFormError } from "@/utils/validationError";
import { UseFormReturn } from "react-hook-form";

export default function Home() {
  const formSettings: FormField[] = [
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
    },
  ];
  const formRegisterSettings: FormField[] = [
    {
      type: "text",
      name: "name",
      label: "Full name",
      placeholder: "Enter your name (John Mark)",
    },
    ...formSettings,
  ];

  const handleSubmit = (type: AuthFormType) => (formState: UseFormReturn) => async (data: Record<string, any>) => {
    const form = type === 'login' ? formSettings : formRegisterSettings
    console.log({ formState});
    
    try {
    
    const response = await customFetch<{ id: number; title: string }[]>(`/auth/${type}`, { method: 'POST', body: JSON.stringify(data)})
    // .then((data) => console.log("Data:", data))
    // .catch((error) => console.error("Error:", error));

    console.log("Form Data:", { data, type, response });
    } catch (e){
      const error = e as AuthError
      if (error.message == 'Validation failed') {
        const { message, fields} = validateDynamicFormError(error.errors, form)
        toast.error(message.join(', \n\t'))
        formState.control._setErrors(fields)
        return;
      }
      toast.error(error?.message)
    }
  };

  return (
    <AppLayout>
      <AuthForm
        registerForm={formRegisterSettings}
        loginForm={formSettings}
        handleSubmit={handleSubmit}
      />
    </AppLayout>
  );
}
