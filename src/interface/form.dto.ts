import * as z from "zod";

export type FormField = {
  type:
    | "hidden"
    | "text"
    | "textarea"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "radio"
    | "otp";
  name: string;
  label?: string;
  placeholder?: string;
  options?: { value: string; label: string }[]; 
  validation?: z.ZodTypeAny; 
  [key:string]: any
};

export type AuthFormType = "login" | "register";
