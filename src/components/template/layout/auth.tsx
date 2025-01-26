"use client";

import * as React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecule/tabs";
import { Input } from "@/components/molecule/input";
import { Button } from "@/components/molecule/button";
import { EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import googleIcon from "@/public/icons/google-icon.svg";
import { AuthFormType, FormField } from "@/interface/form.dto";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import DynamicForm from "@/components/organism/forms/dynamic";

interface AuthFormProps {
  registerForm: FormField[];
  loginForm: FormField[];
  handleSubmit: (type: AuthFormType) => (form: UseFormReturn)=> SubmitHandler<Record<string, any>>;
}
export default function AuthForm(props: AuthFormProps) {
  const renderFormTemplate = (
    formTemplate: FormField[],
    template: AuthFormType
  ) => (
    <>
      <div className="pt-1" />
      <Button
        variant="outline"
        className="w-full h-[46px] text-base font-normal"
      >
        <Image
          src={googleIcon}
          alt="Google logo"
          width={20}
          height={20}
          className="mr-2"
        />
        <span className="text-black font-medium text-sm">Continue with Google</span>
      </Button>

      <br />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or set up with email
          </span>
        </div>
      </div>
      <br />

      <DynamicForm
        onSubmit={props.handleSubmit(template)}
        formSettings={formTemplate}
      >
        {(form) => (
          <>
            <div className="text-sm text-center text-tin mt-6 py-4">
              By {template === 'register' ? "creating an account," : "continuing,"} you agree with our{" "}
              <Link href="#" className="underline hover:text-foreground text-onyx">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline hover:text-foreground text-onyx">
                Privacy Policy
              </Link>
              .
            </div>

            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
              className="w-full h-[46px] text-base  mt-4"
            >
              {template === 'login' ? "Login to Account": "Create Account"}
            </Button>
          </>
        )}
      </DynamicForm>
    </>
  );
  return (
    <div className="container relative min-h-screen flex items-center justify-center">
      <div className="mx-auto w-full max-w-[440px] space-y-6 ">
        <Tabs defaultValue="create" className="w-full  pb-7 mb-4">
          <TabsList className="w-full grid grid-cols-2 mb-8 bg-transparent">
            <TabsTrigger
              value="login"
              className="text-base font-normal bg-transparent data-[state=active]:border-b-gray-800 rounded-none border-b-2 data-[state=active]:font-bold pb-4 data-[state=active]:shadow-none data-[state=inactive]:text-gray-500"
            >
              Log in
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="text-base font-normal bg-transparent data-[state=active]:border-b-gray-800 rounded-none border-b-2 data-[state=active]:font-bold pb-4 data-[state=active]:shadow-none data-[state=inactive]:text-gray-500"
            >
              Create Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-6 flex flex-col">
            {renderFormTemplate(props.registerForm, "register")}
          </TabsContent>
          <TabsContent value="login" className="space-y-6 flex flex-col">
            {renderFormTemplate(props.loginForm, "login")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
