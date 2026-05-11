// responsibility: manages socket connection lifecycle and relaying for rooms
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events';
import { generateRoomCode } from '../utils/roomCode';

// In-memory store for active rooms to bypass socket.io internal room filtering
const activeRooms = new Set<string>();

export function setupSocketManager(io: Server) {
  io.on(SOCKET_EVENTS.CONNECTION, (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.CREATE_ROOM, () => {
      const roomCode = generateRoomCode();
      
      // Add to our explicit tracker
      activeRooms.add(roomCode);
      
      socket.join(roomCode);
      socket.emit(SOCKET_EVENTS.ROOM_CREATED, { roomId: roomCode });
      
      console.log(`Room created: ${roomCode} by ${socket.id}`);
      console.log(`Current Active Rooms:`, Array.from(activeRooms));
    });

    socket.on(SOCKET_EVENTS.JOIN_ROOM, ({ roomId }: { roomId: string }) => {
      const normalizedRoomId = (roomId || '').trim().toUpperCase();
      
      console.log(`--- Join Request ---`);
      console.log(`Socket: ${socket.id}`);
      console.log(`Target Room: ${normalizedRoomId}`);
      
      // Check our explicit tracker instead of socket.io internal state
      if (activeRooms.has(normalizedRoomId)) {
        socket.join(normalizedRoomId);
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, { roomId: normalizedRoomId });
        
        // Notify the desktop that a phone has joined
        socket.to(normalizedRoomId).emit(SOCKET_EVENTS.PHONE_CONNECTED);
        
        console.log(`SUCCESS: ${socket.id} joined ${normalizedRoomId}`);
      } else {
        console.warn(`FAILED: Room ${normalizedRoomId} not found in activeRooms tracker`);
        console.log(`Available:`, Array.from(activeRooms));
        
        socket.emit(SOCKET_EVENTS.ROOM_ERROR, { 
          message: `Room ${normalizedRoomId} not found. Please refresh the desktop app to get a new code.` 
        });
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
      // Optional: Cleanup empty rooms here if needed
    });
  });
}
