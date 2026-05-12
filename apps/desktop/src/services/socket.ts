import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.DEV 
  ? `http://${window.location.hostname}:3001` 
  : (import.meta.env.VITE_SOCKET_URL || 'https://server-production-4444.up.railway.app');

console.log('Desktop connecting to socket at:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
});
