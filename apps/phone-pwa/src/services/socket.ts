import { io } from 'socket.io-client';

// Dynamically determine socket URL:
// - In dev: Use current hostname (works for localhost and local network IP)
// - In prod: Use the Railway production URL
const SOCKET_URL = import.meta.env.DEV 
  ? `http://${window.location.hostname}:3001` 
  : 'https://server-production-4444.up.railway.app';

console.log('Connecting to socket at:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
