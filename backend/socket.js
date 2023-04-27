import { Server } from 'socket.io';
let io;

export const SocketServer = {
  init: (httpServer, options) => {
    io = new Server(httpServer, options);
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
