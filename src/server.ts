import type { Server } from 'http';
import { app } from './app';
import envVariables from './app/config/env';
import { prisma } from './app/config/prisma';
import { socketService } from './app/config/socket.config';
import './app/modules/notification/notification.worker';
import './app/modules/csv/csv-processing.worker';

let server: Server;

async function connectToDb() {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('Database connected successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Database connection error: ${error}`);
  }
}

async function startServer() {
  try {
    await connectToDb();
    server = await app.listen(envVariables.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${envVariables.PORT}`);
    });

    // Initialize Socket.io
    socketService.init(server);

    // eslint-disable-next-line no-console
    console.log('Notification and CSV workers are active');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

startServer();

//  handle graceful shutdown SIGTERM
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('HTTP server closed');
    });
  }
});

//  handle graceful shutdown SIGINT
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('HTTP server closed');
    });
  }
});

// handle unhandledRejection
process.on('unhandledRejection', (reason, promise) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//  handle uncaughtException
process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
