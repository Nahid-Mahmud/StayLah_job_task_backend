import { StatusCodes } from 'http-status-codes';
import { dashboardService } from './dashboard.service';
import sendResponse from '../../../utils/sendResponse';

export const dashboardController = {
  async getSummary(req: any, res: any, next: any) {
    try {
      const { startDate, endDate, companyType, businessType } = req.query;

      const filters = {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        companyType,
        businessType,
      };

      const result = await dashboardService.getSummary(filters);

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
