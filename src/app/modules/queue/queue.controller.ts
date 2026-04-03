import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { notificationQueue } from '../notification/notification.queue';
import sendResponse from '../../../utils/sendResponse';
import { catchAsync } from '../../../utils/catchAsync';

export const queueController = {
  getStatus: catchAsync(async (req: Request, res: Response) => {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      notificationQueue.getWaitingCount(),
      notificationQueue.getActiveCount(),
      notificationQueue.getCompletedCount(),
      notificationQueue.getFailedCount(),
      notificationQueue.getDelayedCount(),
    ]);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Queue status fetched successfully',
      data: {
        notifications: {
          waiting,
          active,
          completed,
          failed,
          delayed,
        },
      },
    });
  }),
};
