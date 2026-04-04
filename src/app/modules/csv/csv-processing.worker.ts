import { Worker } from 'bullmq';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Prisma, TransactionStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { redisConnection } from '../../../utils/redis';
import { socketService } from '../../config/socket.config';

const CHUNK_SIZE = 1000;
const BATCH_SIZE = 5000;

export const csvWorker = new Worker(
  'csv-processing',
  async (job) => {
    const { filePath } = job.data;

    // eslint-disable-next-line no-console
    console.log(`Processing CSV file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      socketService.emit('CSVProcessingUpdate', {
        status: 'error',
        message: `File not found: ${filePath}`,
      });
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const stream = fs.createReadStream(filePath);
      const parser = stream.pipe(csvParser());

      let batch: Record<string, string>[] = [];
      let totalProcessed = 0;

      for await (const row of parser) {
        if (!row.amount || row.amount.trim() === '') {
          continue;
        }

        batch.push(row);

        if (batch.length >= BATCH_SIZE) {
          await processBatchInTransaction(batch);
          totalProcessed += batch.length;
          batch = [];

          await job.updateProgress(
            Math.min(95, Math.floor((totalProcessed / 100000) * 100))
          );
        }
      }

      if (batch.length > 0) {
        await processBatchInTransaction(batch);
        totalProcessed += batch.length;
      }

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      socketService.emit('CSVProcessingUpdate', {
        status: 'success',
        message: `CSV file processed successfully. Total records: ${totalProcessed}`,
        totalProcessed,
      });

      return { success: true, totalProcessed };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error processing CSV: ${error}`);
      socketService.emit('CSVProcessingUpdate', {
        status: 'error',
        message: `Error processing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      throw error;
    }
  },
  {
    connection: redisConnection,
  }
);

const processBatchInTransaction = async (batch: Record<string, string>[]) => {
  await prisma.$transaction(async (tx) => {
    const chunks = chunkArray(batch, CHUNK_SIZE);

    for (const chunk of chunks) {
      // 1. Extract valid UUIDs to check against the database
      const rawHotelIds = chunk
        .map((row) => row.hotel_id || row.hotelId || '')
        .filter((id) =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
        );

      // 2. Find which hotel IDs actually exist to prevent FK violations
      const existingHotels = await tx.hotel.findMany({
        where: { id: { in: rawHotelIds } },
        select: { id: true },
      });
      const validHotelIds = new Set(existingHotels.map((h) => h.id));

      const transactionsData = chunk
        .filter((row) => {
          const id = row.hotel_id || row.hotelId || '';
          return validHotelIds.has(id);
        })
        .map((row) => {
          // 3. Clean the input
          const rawStatus = row.status?.trim().toLowerCase();

          // 4. Map to the exact Enum key used in your schema.prisma
          let finalStatus: TransactionStatus;
          if (rawStatus === 'completed') finalStatus = TransactionStatus.success;
          else if (rawStatus === 'failed') finalStatus = TransactionStatus.failed;
          else finalStatus = TransactionStatus.pending;

          return {
            hotelId: row.hotel_id || row.hotelId || '',
            amount: new Prisma.Decimal(parseFloat(row.amount) || 0),
            status: finalStatus,
            createdAt: row.created_at ? new Date(row.created_at) : new Date(),
          };
        });

      if (transactionsData.length > 0) {
        await tx.transaction.createMany({
          data: transactionsData,
          skipDuplicates: true,
        });
      }
    }
  });
};

const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
