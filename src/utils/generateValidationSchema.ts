import { FormField } from '@/interface/form.dto';
import * as z from 'zod';

export const generateValidationSchema = (formSettings: FormField[]) => {
    const schemaObject = formSettings.reduce((acc, field) => {
      let schema = field.validation || z.any(); // Use custom validation if provided
  
      // Default validation based on field type
      if (!field.validation) {
        switch (field.type) {
          case 'email':
            schema = z.string().email(`${field.label} must be a valid email`);
            break;
          case 'password':
            schema = z.string().min(6, `${field.label} must be at least 6 characters`);
            break;
          case 'number':
            schema = z.number().min(1, `${field.label} must be a number`);
            break;
          case 'checkbox':
            schema = z.boolean().refine((val) => val === true, `${field.label} must be checked`);
            break;
          case 'select':
          case 'radio':
            schema = z.string().min(1, `${field.label} is required`);
            break;
          default:
            schema = z.string().min(1, `${field.label} is required`);
        }
      }
  
      return { ...acc, [field.name]: schema };
    }, {});
  
    return z.object(schemaObject);
  };
  