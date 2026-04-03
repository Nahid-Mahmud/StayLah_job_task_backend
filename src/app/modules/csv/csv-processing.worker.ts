import { Worker } from 'bullmq';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { redisConnection } from '../../../utils/redis';

export const csvWorker = new Worker(
  'csv-processing',
  async (job) => {
    const { filePath } = job.data;

    // eslint-disable-next-line no-console
    console.log(`Processing CSV file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const stream = fs.createReadStream(filePath).pipe(csvParser());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chunk: any[] = [];
      const CHUNK_SIZE = 1000;

      for await (const row of stream) {
        chunk.push(row);
        if (chunk.length >= CHUNK_SIZE) {
          await processChunk(chunk);
          chunk = [];
        }
      }

      if (chunk.length > 0) {
        await processChunk(chunk);
      }

      // Cleanup
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return { success: true };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error processing CSV: ${error}`);
      throw error;
    }
  },
  {
    connection: redisConnection,
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processChunk = async (chunk: any[]) => {
  // Map data to Prisma model
  const transactionsData = chunk.map((row) => ({
    hotelId: row.hotel_id,
    amount: new Prisma.Decimal(row.amount),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: (row.status as any) || 'pending',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  }));

  // Perform bulk insert in a transaction
  await prisma.transaction.createMany({
    data: transactionsData,
    skipDuplicates: true,
  });
};
