import { BusinessType, CompanyType } from '@prisma/client';
import { z } from 'zod';

const getFirstQueryValue = (value: unknown) => {
  const val = Array.isArray(value) ? value[0] : value;
  return val === '' ? undefined : val;
};

const dashboardSummaryQuerySchema = z
  .object({
    startDate: z.preprocess(getFirstQueryValue, z.coerce.date().optional()),
    endDate: z.preprocess(getFirstQueryValue, z.coerce.date().optional()),
    companyType: z.preprocess(
      getFirstQueryValue,
      z.nativeEnum(CompanyType).optional()
    ),
    businessType: z.preprocess(
      getFirstQueryValue,
      z.nativeEnum(BusinessType).optional()
    ),
  })
  .refine(
    ({ startDate, endDate }) => !startDate || !endDate || startDate <= endDate,
    {
      message: 'startDate must be before or equal to endDate',
      path: ['startDate'],
    }
  );

const getSummaryValidationSchema = z.object({
  query: dashboardSummaryQuerySchema,
});

export const dashboardValidation = {
  dashboardSummaryQuerySchema,
  getSummaryValidationSchema,
};
