import React from "react";
import { useForm, SubmitHandler, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/interface/form.dto";
import { generateValidationSchema } from "@/utils/generateValidationSchema";
import { Input, PasswordInput } from "@/components/molecule/input";

interface DynamicFormProps {
  formSettings: FormField[];
  onSubmit: SubmitHandler<Record<string, any>>;
  children: (form: UseFormReturn) => React.ReactNode;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  formSettings,
  onSubmit,
  children,
}) => {
  const validationSchema = generateValidationSchema(formSettings);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(validationSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const renderFormInput = (field) => {
    switch (field.type) {
      case "select":
        return (
          <select id={field.name} {...register(field.name)}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <Input
            className="h-[46px]"
            type="checkbox"
            id={field.name}
            defaultChecked={true}
            {...register(field.name)}
          />
        );
      case "radio":
        return (
          <div>
            {field.options?.map((option) => (
              <div key={option.value}>
                <Input
                  className="h-[46px]"
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  value={option.value}
                  {...register(field.name)}
                />
                <label htmlFor={`${field.name}-${option.value}`}>
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case "password":
        return (
          <PasswordInput
            className="h-[46px]"
            type={field.type}
            id={field.name}
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        );
      default:
       return <Input
          className="h-[46px]"
          type={field.type}
          id={field.name}
          placeholder={field.placeholder}
          {...register(field.name)}
        />;
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formSettings.map((field) => (
        <div
          className="space-y-2"
          key={field.name}
          style={{ marginBottom: "1rem" }}
        >
          <label htmlFor={field.name} className="text-base font-medium">
            {field.label}
          </label>
          {renderFormInput(field)}
          {errors[field.name] && (
            <p style={{ color: "red" }}>
              {errors[field.name]?.message?.toString()}
            </p>
          )}
        </div>
      ))}
      {children?.(form) || <button type="submit">Submit</button>}
    </form>
  );
};

export default DynamicForm;
