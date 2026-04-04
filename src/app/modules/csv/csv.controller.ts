import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import { addCSVJob, csvQueue } from './csv-processing.queue';
import { catchAsync } from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';

export const csvController = {
  uploadCSV: catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const tempPath = path.join(
      process.cwd(),
      'uploads',
      `upload-${Date.now()}.csv`
    );

    if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'));
    }

    fs.writeFileSync(tempPath, req.file.buffer);

    const job = await addCSVJob(tempPath);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.ACCEPTED,
      message: 'CSV file uploaded and processing started',
      data: { jobId: job.id },
    });
  }),

  getJobStatus: catchAsync(async (req: Request, res: Response) => {
    const { jobId } = req.params as { jobId: string };

    const job = await csvQueue.getJob(jobId);

    if (!job) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Job not found',
      });
      return;
    }

    const state = await job.getState();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Job status retrieved',
      data: {
        id: job.id,
        status: state,
        progress: job.progress,
        failedReason: job.failedReason,
      },
    });
  }),
};
