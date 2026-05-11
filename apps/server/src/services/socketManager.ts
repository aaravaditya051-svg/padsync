// responsibility: manages socket connection lifecycle and relaying for rooms
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';
import { generateRoomCode } from '../utils/roomCode';

export function setupSocketManager(io: Server) {
  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.CREATE_ROOM, () => {
      const roomCode = generateRoomCode();
      socket.join(roomCode);
      socket.emit(SOCKET_EVENTS.ROOM_CREATED, { roomId: roomCode });
      console.log(`Room created: ${roomCode} by ${socket.id}`);
    });

    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId }: { roomId: string }) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        socket.join(roomId);
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId });
        socket.to(roomId).emit(SOCKET_EVENTS.PHONE_CONNECTED);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
      } else {
        socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: 'Room not found' });
      }
    });

    socket.on(SOCKET_EVENTS.TLDRAW_PATCH, ({ roomId, patch }: { roomId: string, patch: any }) => {
      socket.to(roomId).emit(SOCKET_EVENTS.TLDRAW_PATCH, { patch });
    });

    socket.on('ping', (callback: () => void) => {
      if (typeof callback === 'function') callback();
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
