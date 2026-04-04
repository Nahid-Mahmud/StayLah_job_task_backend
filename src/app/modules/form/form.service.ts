import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const formService = {
  createForm: async (data: { name: string; schema: Prisma.InputJsonValue }) => {
    return prisma.form.create({
      data: {
        name: data.name,
        schema: data.schema,
      },
    });
  },

  getAllForms: async () => {
    return prisma.form.findMany();
  },

  getFormById: async (id: string) => {
    return prisma.form.findUnique({
      where: { id },
    });
  },

  submitForm: async (formId: string, data: Prisma.InputJsonValue) => {
    return prisma.formSubmission.create({
      data: {
        formId,
        data,
      },
    });
  },
};
