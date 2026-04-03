import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { formService } from './form.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

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
    const result = await formService.submitForm(id as string, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Form submitted successfully',
      data: result,
    });
  }),
};
