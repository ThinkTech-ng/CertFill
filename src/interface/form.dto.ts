import * as z from "zod";

export type FormField = {
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "radio";
  name: string;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[]; // For select, radio, and checkbox
  validation?: z.ZodTypeAny; // Custom validation schema
};

export type AuthFormType = "login" | "register";
