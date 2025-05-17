import React from 'react';
import {
  useForm,
  SubmitHandler,
  UseFormReturn,
  useFieldArray,
  UseFieldArrayReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/interface/form.dto';
import { generateValidationSchema } from '@/utils/generateValidationSchema';
import { Input, OtpInput, PasswordInput } from '@/components/molecule/input';
import { Textarea } from '@/components/molecule/textarea';
import { cn } from '@/utils/utils';

interface DynamicFormProps {
  hideError?: boolean;
  formSettings: FormField[];
  onSubmit: (form: UseFormReturn) => SubmitHandler<Record<string, any>>;
  children: (form: UseFormReturn) => React.ReactNode;
  defaultValues?: Record<any, any>;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  formSettings,
  onSubmit,
  children,
  hideError,
  defaultValues,
}) => {
  const validationSchema = generateValidationSchema(formSettings);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const renderFormInput = (field: FormField) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            className={cn('inputField block w-full flex-1', field?.className)}
            id={field.name}
            {...register(field.name)}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <Input
            className={cn('h-[46px]', field.inputClassName)}
            type="checkbox"
            id={field.name}
            defaultChecked={true}
            {...register(field.name)}
          />
        );
      case 'radio':
        return (
          <div>
            {field.options?.map((option) => (
              <div key={option.value}>
                <Input
                  className={cn('h-[46px]', field.inputClassName)}
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  value={option.value}
                  {...register(field.name)}
                />
                <label htmlFor={`${field.name}-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
        );
      case 'password':
        return (
          <PasswordInput
            className={cn('h-[46px]', field.inputClassName)}
            type={field.type}
            id={field.name}
            placeholder={field.placeholder}
            {...(register(field.name) as any)}
          />
        );
      case 'otp':
        const action = register(field.name);
        return (
          <OtpInput
            className={cn('h-[46px]', field.inputClassName)}
            id={field.name}
            placeholder={field.placeholder}
            inputMode="search"
            {...(field as any)}
            {...(action as any)}
            onChange={(value) => {
              form.setValue(field.name, value, { shouldValidate: true });
            }}
            onComplete={(value) => {
              form.setValue(field.name, value, { shouldValidate: true });
            }}
          />
        );
      case 'textarea':
        return (
          <Textarea
            className={cn('h-[46px]', field.inputClassName)}
            id={field.name}
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        );
      default:
        return (
          <Input
            className={cn('h-[46px]', field.inputClassName)}
            type={field.type}
            id={field.name}
            placeholder={field.placeholder}
            {...register(field.name)}
          />
        );
    }
  };
  React.useEffect(() => {
    formSettings.forEach(({ name }) => {
      form.watch(name);
    });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit(form))}>
      {formSettings.map((field) => (
        <div className="space-y-2" key={field.name} style={{ marginBottom: '1rem' }}>
          <label htmlFor={field.name} className={cn('text-base font-medium', field.labelClassName)}>
            {field.label}
          </label>
          {renderFormInput(field)}
          {!hideError && errors[field.name] && (
            <p className="text-cloakGrey text-red-500 text-sm flex ">
              <span className="text-[10px] pr-1">&#9679;</span>
              <span> {(errors[field.name]?.message || errors[field.name])?.toString()}</span>
            </p>
          )}
        </div>
      ))}
      {children?.(form) || <button type="submit">Submit</button>}
    </form>
  );
};

export default DynamicForm;

interface DynamicArrayFormProps {
  name: string;
  children: (value: UseFieldArrayReturn) => string | React.ReactNode;
  control: UseFormReturn['control'];
}
export const DynamicArrayForm: React.FC<DynamicArrayFormProps> = ({ control, name, children }) => {
  const form = useFieldArray({
    control,
    name,
  });

  return <>{children(form)}</>;
};
