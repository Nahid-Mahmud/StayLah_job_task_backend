import { Queue } from 'bullmq';
import { redisConnection } from '../../../utils/redis';

export const csvQueue = new Queue('csv-processing', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addCSVJob = async (filePath: string) => {
  await csvQueue.add('process-csv', { filePath });
};
