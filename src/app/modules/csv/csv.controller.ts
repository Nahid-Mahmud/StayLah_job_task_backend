import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fs from 'fs';
import path from 'path';
import { addCSVJob } from './csv-processing.queue';
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

    // Since we used memoryStorage in multer.config.ts, we need to save it to disk for the worker
    // Or we should have used diskStorage. Let's save the buffer to a temp file.
    const tempPath = path.join(process.cwd(), 'uploads', `upload-${Date.now()}.csv`);
    
    if (!fs.existsSync(path.join(process.cwd(), 'uploads'))) {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'));
    }

    fs.writeFileSync(tempPath, req.file.buffer);

    // Add job to queue
    await addCSVJob(tempPath);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.ACCEPTED,
      message: 'CSV file uploaded and processing started',
      data: { filePath: tempPath },
    });
  }),
};
