import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { formService } from './form.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { IFormSchema, generateZodSchema } from './form.utils';

export const formController = {
  createForm: catchAsync(async (req: Request, res: Response) => {
    const { name, schema } = req.body;
    const result = await formService.createForm({ name, schema });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Form created successfully',
      data: result,
    });
  }),

  getAllForms: catchAsync(async (req: Request, res: Response) => {
    const result = await formService.getAllForms();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Forms fetched successfully',
      data: result,
    });
  }),

  getFormById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await formService.getFormById(id as string);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Form fetched successfully',
      data: result,
    });
  }),

  submitForm: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    // Fetch form and validation schema
    const form = await formService.getFormById(id as string);
    if (!form) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Form not found',
      });
      return;
    }

    const dynamicSchema = generateZodSchema(
      form.schema as unknown as IFormSchema
    );

    // Validate the incoming data against the dynamic schema
    const validatedData = dynamicSchema.parse(data);

    const result = await formService.submitForm(
      id as string,
      validatedData as Prisma.InputJsonValue
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Form submitted successfully',
      data: result,
    });
  }),
};
