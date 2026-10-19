import { joinChat, leaveChat, getUsersOnline, disconnectChat } from '../services/chat.service.js';

function registerChatSocket(io, socket) {

    socket.emit('info', getUsersOnline());

    socket.on('join', (user) => {
        joinChat(user, socket.id);
        broadcastOnlineUsers(io);
    });

    socket.on('leave', () => {
        leaveChat(socket.id);
        broadcastOnlineUsers(io);
    });

    socket.on('disconnect', () => {
        disconnectChat(socket.id, () => {
            broadcastOnlineUsers(io);
        });
    });
}

function broadcastOnlineUsers(io) {
    io.emit('info', getUsersOnline());
}

export { registerChatSocket }
