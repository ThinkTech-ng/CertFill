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
import { User } from "@/interface/user.dto";
import { useRouter, useSearchParams } from "next/navigation";
import * as rout from "next/navigation";
import React from "react";
import { useSessionStorage } from 'usehooks-ts'

export default function Home() {
  const router = useRouter()
  const [, setTempEmail] = useSessionStorage('temp-email', null)
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
    setTempEmail(data.email)
    
    try {
    
    const response = await customFetch<{ data: User, status: AuthError['status'] }>(`/auth/${type}`, { method: 'POST', body: JSON.stringify(data)})

    if (type === 'register' && response.data.email && response.data.id && response.status === 'success') {
      // regirest to verify user
      router.push('/verify')
    }
    console.log("Form Data:", { data, type, response });
    router.push('/admib')
    } catch (e){
      const error = e as AuthError
      if (error.message == 'Validation failed') {
        const { message, fields} = validateDynamicFormError(error.errors, form)
        toast.error(message.join(', \n\t'))
        formState.control._setErrors(fields)
        return;
      }
      if (error.code === 'EMAIL_VERIFICATION') {

        router.push('/verify')
      }
      toast.error(error?.message)
    }
  };

  React.useEffect(()=>{
    router.prefetch('/admin')
    router.prefetch('/verify')
  }, [])
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
