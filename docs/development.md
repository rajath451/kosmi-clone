# Development Guide

## Setup

### Initial Setup
```bash
git clone https://github.com/rajath451/kosmi-clone.git
cd kosmi-clone
npm run install:all
```

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts both the backend server (port 5000) and frontend dev server (port 5173).

### Individual Servers
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend
npm run client:dev
```

## Project Structure

### Backend Structure
- `server.js` - Main server file with Express and Socket.IO setup
- Routes and controllers are in server.js (to be modularized)
- Real-time events handled via Socket.IO namespace

### Frontend Structure (to be created)
- `client/src/components/` - Reusable React components
- `client/src/pages/` - Page-level components
- `client/src/utils/` - Utility functions and helpers
- `client/src/hooks/` - Custom React hooks

## Adding Features

### Backend
1. Add Socket.IO event handler in `server.js`
2. Update room/user data models if needed
3. Test with Socket.IO client in browser console

### Frontend
1. Create component in `client/src/components/`
2. Use Socket.IO client to emit/listen to events
3. Update state management as needed

## Common Tasks

### Creating a New Room Type
1. Add theme to `room.theme` validation
2. Add theme assets to frontend
3. Update room creation UI

### Adding a New Socket Event
1. Define event handler in backend: `socket.on('event-name', (data) => {...})`
2. Use in frontend: `socket.emit('event-name', data)`
3. Listen in frontend: `socket.on('event-name', (data) => {...})`

## Testing

### Manual Testing
1. Open two browser windows/tabs
2. Join same room in both
3. Test video sync and chat

### Using Browser Console
```javascript
// Connect to Socket.IO
const socket = io('http://localhost:5000');

// Join room
socket.emit('join-room', {
  roomId: 'your-room-id',
  username: 'TestUser'
});

// Send message
socket.emit('send-message', {
  text: 'Hello everyone!'
});

// Listen to events
socket.on('new-message', (msg) => console.log(msg));
```

## Debugging

### Backend Logs
- Check server console output for connection logs
- Add console.log() for debugging

### Frontend
- Use browser DevTools
- Check Network tab for Socket.IO connections
- Use React DevTools extension

## Performance Tips

1. Debounce video seek events
2. Throttle chat message sending
3. Limit chat history display
4. Use React.memo for components that don't need frequent updates

## Common Issues

### CORS Errors
- Ensure `CLIENT_URL` in `.env` matches your frontend URL
- Check Socket.IO CORS configuration

### Socket Connection Issues
- Verify backend is running on correct port
- Check browser console for errors
- Ensure firewall isn't blocking connections

### Video Sync Issues
- Add delays to account for network latency
- Implement tolerance (sync within ±0.5 seconds)
- Resync when drift exceeds tolerance
