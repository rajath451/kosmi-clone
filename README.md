# Kosmi Clone

A browser-based watch party and virtual hangout platform inspired by Kosmi. Watch videos together, play games, and hangout with friends online.

## Features

- 🎬 **Synchronized Video Playback** - Watch videos together in perfect sync
- 💬 **Real-time Chat** - Communicate with room members instantly
- 🎮 **Multiplayer Games** - Built-in games (planned)
- 📹 **Video/Voice Chat** - Integrated communication (planned)
- 🎨 **Customizable Rooms** - Different themes for your hangout space
- 🔗 **Easy Sharing** - Share room links with friends
- 🚀 **No Sign-up Required** - Quick access via room link

## Tech Stack

**Backend:**
- Node.js + Express
- Socket.IO for real-time communication
- WebRTC for peer-to-peer video/audio (planned)

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Socket.IO client

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/rajath451/kosmi-clone.git
cd kosmi-clone
```

2. Install dependencies
```bash
npm run install:all
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Run development servers
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
kosmi-clone/
├── server.js              # Express + Socket.IO server
├── package.json           # Server dependencies
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Usage

1. Create a new room
2. Share the room link with friends
3. Add video URL to start watching
4. Chat and enjoy!

## API Endpoints

### REST API
- `POST /api/rooms/create` - Create a new room
- `GET /api/rooms/:roomId` - Get room details
- `GET /api/health` - Server health check

### WebSocket Events
- `join-room` - Join a room
- `video-play` - Sync video play
- `video-pause` - Sync video pause
- `video-seek` - Sync video seek
- `send-message` - Send chat message
- `disconnect` - Leave room

## Roadmap

- [ ] Frontend UI with React
- [ ] Video player with YouTube/Vimeo support
- [ ] Peer-to-peer video/audio chat using WebRTC
- [ ] Built-in multiplayer games
- [ ] User authentication (optional)
- [ ] Room persistence with database
- [ ] Mobile app (React Native)
- [ ] Advanced features (screen sharing, file sharing)

## Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

## License

MIT
