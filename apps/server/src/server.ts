import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketManager } from './services/socketManager';

dotenv.config();

const app = express();
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.send({ status: 'ok', time: new Date().toISOString() });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e7, // 10MB
  pingTimeout: 60000,
  pingInterval: 25000
});

setupSocketManager(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`PadSync Signaling Server running on port ${PORT}`);
});

// Log any server-level errors
server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});
