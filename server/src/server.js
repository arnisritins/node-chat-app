import http from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { registerChatSocket } from './sockets/chat.socket.js';

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
    registerChatSocket(io, socket);
});

httpServer.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
