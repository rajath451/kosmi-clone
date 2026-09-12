# Kosmi Clone - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────┐
│          Frontend (React/Vite)              │
│  ┌──────────────────────────────────────┐   │
│  │  Components                          │   │
│  │  - RoomView                          │   │
│  │  - VideoPlayer                       │   │
│  │  - ChatBox                           │   │
│  │  - UserList                          │   │
│  └──────────────────────────────────────┘   │
│              │                               │
│              └─── Socket.IO Client ───────┐ │
└─────────────────────────────────────────── │ ─
                                            │
                    ┌─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│    Backend (Node.js + Express)              │
│  ┌──────────────────────────────────────┐   │
│  │  Socket.IO Server                    │   │
│  │  - Room Management                   │   │
│  │  - User Connection Handling          │   │
│  │  - Video Sync Logic                  │   │
│  │  - Message Broadcasting              │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  REST API                            │   │
│  │  - POST /api/rooms/create            │   │
│  │  - GET /api/rooms/:roomId            │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────────────────────────────────┐   │
│  │  In-Memory Data Store                │   │
│  │  - Rooms Map                         │   │
│  │  - Users Map                         │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Data Models

### Room
```javascript
{
  id: string (UUID),
  name: string,
  theme: string ('living-room', 'pub', 'coffee-shop', etc),
  isPrivate: boolean,
  createdAt: timestamp,
  users: User[],
  currentVideo: {
    url: string,
    title: string
  },
  videoSync: {
    time: number (seconds),
    playing: boolean
  },
  chat: Message[]
}
```

### User
```javascript
{
  id: string (socket.id),
  username: string,
  joinedAt: timestamp
}
```

### Message
```javascript
{
  id: string (UUID),
  username: string,
  text: string,
  timestamp: timestamp
}
```

## Communication Flow

### Video Synchronization
1. User plays video → `video-play` event sent to server
2. Server updates room state with current time and playing status
3. Server broadcasts `video-sync` to all users in room
4. All clients update video player to match sync state

### Chat System
1. User sends message → `send-message` event
2. Server creates message object and stores in room
3. Server broadcasts `new-message` to all room members
4. Chat UI updates with new message

### User Management
1. User joins room → `join-room` event with username
2. Server adds user to room and stores connection
3. Server broadcasts `user-joined` to existing members
4. New user receives `room-data` with current room state
5. On disconnect → cleanup and broadcast `user-left`

## Future Enhancements

### Database Integration
- Replace in-memory storage with MongoDB/PostgreSQL
- Persist room history and chat logs
- User accounts and profiles

### WebRTC Integration
- Peer-to-peer video/audio chat
- Screen sharing capability
- Connection establishment through Socket.IO signaling

### Advanced Features
- Queue system for videos
- Reaction system (emojis, voting)
- User roles (host, moderator, guest)
- Room settings (max users, chat filters)
- Analytics and activity tracking

## Scalability Considerations

1. **Horizontal Scaling**: Use Redis for Socket.IO adapter
2. **Load Balancing**: Nginx/HAProxy for distributing connections
3. **Microservices**: Separate services for video processing, notifications
4. **Caching**: Redis for room state and user sessions
5. **CDN**: Distribute static assets globally
