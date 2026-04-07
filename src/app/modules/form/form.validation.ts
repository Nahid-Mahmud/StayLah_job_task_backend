import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fieldSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    name: z.string().min(1, 'Field name is required'),
    label: z.string().min(1, 'Field label is required'),
    type: z.enum(['text', 'number', 'select', 'nested']),
    required: z.boolean().optional(),
    options: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .optional(),
    fields: z.array(fieldSchema).optional(),
  })
);

const createFormValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Form name is required').trim(),
    schema: z.object({
      title: z.string().min(1, 'Form title is required'),
      description: z.string().optional(),
      fields: z.array(fieldSchema).min(1, 'At least one field is required'),
    }),
  }),
});

const getFormByIdValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid form id'),
  }),
});

const submitFormValidationSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid form id'),
  }),
  body: z.any(),
});

export const formValidation = {
  createFormValidationSchema,
  getFormByIdValidationSchema,
  submitFormValidationSchema,
};
