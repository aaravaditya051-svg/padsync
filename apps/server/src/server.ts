import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSocketManager } from './services/socketManager';

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSocketManager(io);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`PadSync Signaling Server running on port ${PORT}`);
});
