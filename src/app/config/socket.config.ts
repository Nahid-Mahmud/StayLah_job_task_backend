import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

let io: Server;

export const socketService = {
  init(httpServer: HttpServer) {
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    // eslint-disable-next-line no-console
    console.log('WebSocket server initialized');

    io.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    return io;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, data: any) {
    if (io) {
      io.emit(event, data);
    }
  },

  getIO() {
    return io;
  },
};
