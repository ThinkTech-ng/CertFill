import { AuthError } from '@/interface/error.dto';
import { FormField } from '@/interface/form.dto';

export const validateDynamicFormError = (errors: AuthError['errors'], form: FormField[]) => {
  const validationError = errors.reduce(
    (acc, { field, message }) => {
      const fieldName = form.find((f) => f.name === field)?.label || field;
      const msg = `${fieldName} ${message}`;
      acc.fields[field] = msg;
      acc.message.push(msg);
      return acc;
    },
    {
      fields: {} as Record<any, any>,
      message: [] as string[],
    },
  );
  return validationError;
};
