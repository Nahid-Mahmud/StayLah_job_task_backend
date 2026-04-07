/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { z } from 'zod';

export type IFormField = {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'nested';
  required?: boolean;
  options?: { label: string; value: string }[];
  fields?: IFormField[];
};

export type IFormSchema = {
  title: string;
  description?: string;
  fields: IFormField[];
};

export const generateZodSchema = (formSchema: IFormSchema) => {
  const shape: Record<string, any> = {};

  formSchema.fields.forEach((field) => {
    let fieldZod: z.ZodTypeAny;

    switch (field.type) {
      case 'number':
        fieldZod = z.number();
        break;
      case 'select':
        fieldZod = z.string();
        break;
      case 'nested':
        if (field.fields) {
          // Recursive call for nested fields
          fieldZod = generateZodSchema({ title: '', fields: field.fields });
        } else {
          fieldZod = z.object({});
        }
        break;
      case 'text':
      default:
        fieldZod = z.string();
        break;
    }

    if (!field.required) {
      fieldZod = fieldZod.optional().nullable();
    } else {
      fieldZod = fieldZod.refine(
        (val) => val !== undefined && val !== null && val !== '',
        {
          message: `${field.label} is required`,
        }
      );
    }

    shape[field.name] = fieldZod;
  });

  return z.object(shape);
};
