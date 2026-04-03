import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { searchService } from './search.service';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export const searchController = {
  searchHotels: catchAsync(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Search query "q" is required',
      });
      return;
    }

    const result = await searchService.searchHotels(q);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Search results fetched successfully',
      data: result,
    });
  }),
};
