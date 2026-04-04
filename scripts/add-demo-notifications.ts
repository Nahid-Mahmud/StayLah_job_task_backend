import '../src/app/config/env';
import { addNotificationJob } from '../src/app/modules/notification/notification.queue';

const demoNotifications = [
  {
    transactionId: 'txn-demo-001',
    hotelId: 'hotel_123',
    reason: 'Payment declined by bank',
  },
  {
    transactionId: 'txn-demo-002',
    hotelId: 'hotel_456',
    reason: 'Insufficient funds',
  },
  {
    transactionId: 'txn-demo-003',
    hotelId: 'hotel_789',
    reason: 'Fraud suspected',
  },
];

const main = async () => {
  console.log('Adding demo notification jobs...');

  for (const notification of demoNotifications) {
    await addNotificationJob('TransactionFailed', notification);
    console.log(
      `Queued demo notification for transaction ${notification.transactionId}`
    );
  }

  console.log('All demo notifications have been queued.');
  process.exit(0);
};

main().catch((error) => {
  console.error('Failed to add demo notifications:', error);
  process.exit(1);
});
