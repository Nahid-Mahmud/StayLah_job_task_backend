import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../utils/sendResponse';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashboardService.getSummary(req.query);

      sendResponse(res, {
        success: true,
        message: 'Dashboard summary fetched successfully',
        data: result,
        statusCode: StatusCodes.OK,
      });
    } catch (error) {
      next(error);
    }
  },
};
