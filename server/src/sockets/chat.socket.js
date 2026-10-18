import { joinUser, leaveUser, getOnlineCount, handleDisconnect } from '../services/chat.service.js';

function registerChatSocket(io, socket) {

    socket.emit('info', getOnlineCount());

    socket.on('join', (user) => {
        joinUser(user, socket.id);
        broadcast(io);
    });

    socket.on('leave', () => {
        leaveUser(socket.id);
        broadcast(io);
    });

    socket.on('disconnect', () => {
        handleDisconnect(socket.id, () => {
            broadcast(io);
        });
    });
}

function broadcast(io) {
    io.emit('info', getOnlineCount());
}

export { registerChatSocket }
