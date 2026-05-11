import { io } from 'socket.io-client';

// Reads from env var — set to Railway URL in production, local dev server otherwise
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://server-production-4444.up.railway.app';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
