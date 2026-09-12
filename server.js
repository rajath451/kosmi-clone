import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors());

// In-memory storage for rooms
const rooms = new Map();
const users = new Map();

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/rooms/create', (req, res) => {
  const roomId = uuidv4();
  const room = {
    id: roomId,
    name: req.body.name || 'Untitled Room',
    theme: req.body.theme || 'living-room',
    isPrivate: req.body.isPrivate || false,
    createdAt: new Date(),
    users: [],
    currentVideo: null,
    videoSync: { time: 0, playing: false },
    chat: []
  };
  rooms.set(roomId, room);
  res.json({ roomId, room });
});

app.get('/api/rooms/:roomId', (req, res) => {
  const room = rooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // User joins room
  socket.on('join-room', (data) => {
    const { roomId, username } = data;
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    socket.join(roomId);
    const user = { id: socket.id, username, joinedAt: new Date() };
    users.set(socket.id, { ...user, roomId });
    room.users.push(user);

    // Notify others
    io.to(roomId).emit('user-joined', user);
    socket.emit('room-data', room);
  });

  // Video sync events
  socket.on('video-play', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.videoSync = { time: data.time, playing: true };
        io.to(user.roomId).emit('video-sync', room.videoSync);
      }
    }
  });

  socket.on('video-pause', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.videoSync = { time: data.time, playing: false };
        io.to(user.roomId).emit('video-sync', room.videoSync);
      }
    }
  });

  socket.on('video-seek', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.videoSync.time = data.time;
        io.to(user.roomId).emit('video-sync', room.videoSync);
      }
    }
  });

  // Chat events
  socket.on('send-message', (data) => {
    const user = users.get(socket.id);
    if (user) {
      const message = {
        id: uuidv4(),
        username: user.username,
        text: data.text,
        timestamp: new Date()
      };
      const room = rooms.get(user.roomId);
      if (room) {
        room.chat.push(message);
        io.to(user.roomId).emit('new-message', message);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.users = room.users.filter(u => u.id !== socket.id);
        io.to(user.roomId).emit('user-left', user);
        
        // Clean up empty rooms
        if (room.users.length === 0) {
          rooms.delete(user.roomId);
        }
      }
      users.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
