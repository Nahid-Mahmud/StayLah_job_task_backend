import { Queue } from 'bullmq';
import { redisConnection } from '../../../utils/redis';

export const notificationQueue = new Queue('notifications', {
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

export const addNotificationJob = async (
  type: 'TransactionFailed',
  payload: { transactionId: string; hotelId: string; reason: string }
) => {
  await notificationQueue.add(type, payload);
};
