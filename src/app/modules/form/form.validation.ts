import { z } from 'zod';

const createFormValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Form name is required').trim(),
    schema: z.any().refine((value) => value !== undefined, {
      message: 'Form schema is required',
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
