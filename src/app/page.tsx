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

  const handleSubmit = (type: AuthFormType) => (data: Record<string, any>) => {
    console.log("Form Data:", { data, type });
  };

  return (
    <AppLayout>
      <AuthForm
        registerForm={formSettings}
        loginForm={formSettings}
        handleSubmit={handleSubmit}
      />
    </AppLayout>
  );
}
