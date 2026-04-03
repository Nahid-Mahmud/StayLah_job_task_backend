import { Worker } from 'bullmq';
import { socketService } from '../../config/socket.config';
import { redisConnection } from '../../../utils/redis';

export const notificationWorker = new Worker(
  'notifications',
  async (job) => {
    // eslint-disable-next-line no-console
    console.log(`Processing job ${job.id} for ${job.name}`);

    if (job.name === 'TransactionFailed') {
      const { transactionId, hotelId, reason } = job.data;

      // 1. Log the failure
      // eslint-disable-next-line no-console
      console.error(
        `Transaction failed: ID ${transactionId}, Hotel ID ${hotelId}, Reason: ${reason}`
      );

      // 2. Broadcast via WebSocket
      socketService.emit('transaction_failed', {
        transactionId,
        hotelId,
        reason,
        timestamp: new Date(),
      });
    }
  },
  {
    connection: redisConnection,
  }
);

notificationWorker.on('completed', (job) => {
  // eslint-disable-next-line no-console
  console.log(`Job ${job.id} completed!`);
});

notificationWorker.on('failed', (job, err) => {
  // eslint-disable-next-line no-console
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
