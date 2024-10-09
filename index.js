const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Relay the offer to other users
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer); // Send to all connected clients except the sender
  });

  // Relay the answer to the caller
  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  // Relay ICE candidates
  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Signaling server is running on http://localhost:${PORT}`);
});
