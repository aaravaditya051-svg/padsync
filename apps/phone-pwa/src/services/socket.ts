import { io } from 'socket.io-client';

// Hardcoded live server URL to ensure connectivity
const SOCKET_URL = 'https://server-production-4444.up.railway.app';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
