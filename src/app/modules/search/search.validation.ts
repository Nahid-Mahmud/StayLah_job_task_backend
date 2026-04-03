import { z } from 'zod';

const searchHotelsValidationSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Search query "q" is required').trim(),
  }),
});

export const searchValidation = {
  searchHotelsValidationSchema,
};
