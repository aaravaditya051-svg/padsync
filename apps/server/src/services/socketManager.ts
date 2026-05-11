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
      console.log(`Current rooms on server:`, Array.from(io.sockets.adapter.rooms.keys()));
    });

    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId }: { roomId: string }) => {
      const normalizedRoomId = roomId.toUpperCase();
      const room = io.sockets.adapter.rooms.get(normalizedRoomId);
      
      console.log(`Join attempt for room: ${normalizedRoomId} by ${socket.id}`);
      console.log(`Available rooms:`, Array.from(io.sockets.adapter.rooms.keys()));

      if (room) {
        socket.join(normalizedRoomId);
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId: normalizedRoomId });
        socket.to(normalizedRoomId).emit(SOCKET_EVENTS.PHONE_CONNECTED);
        console.log(`Socket ${socket.id} successfully joined room: ${normalizedRoomId}`);
      } else {
        console.warn(`Join failed: Room ${normalizedRoomId} not found`);
        socket.emit(SOCKET_EVENTS.ROOM_ERROR, { message: `Room ${normalizedRoomId} not found` });
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
