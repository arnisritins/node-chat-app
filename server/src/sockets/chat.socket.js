const sockets = new Map();
const users = new Map();

const diconnectTimeout = 5000;

function registerChatSocket(io, socket) {

    socket.emit('info', users.size);

    socket.on('join', (user) => {

        let existing = users.get(user.id);

        if (existing) {
            if (existing.disconnectTimer) {
                clearTimeout(existing.disconnectTimer);
                existing.disconnectTimer = null;
            }

            sockets.delete(existing.socketId);

            existing.socketId = socket.id;
            existing.online = true;
        } else {
            users.set(user.id, {
                id: user.id,
                name: user.name,
                socketId: socket.id,
                online: true,
                disconnectTimer: null
            });
        }

        sockets.set(socket.id, user.id);

        broadcast(io);
    });

    socket.on('leave', () => {
        const userId = sockets.get(socket.id);

        if (!userId) 
            return;

        users.delete(userId);
        sockets.delete(socket.id);

        broadcast(io);
    });

    socket.on('disconnect', () => {
        const userId = sockets.get(socket.id);

        if (!userId)
            return;

        const user = users.get(userId);

        if (!user)
            return;

        user.online = false;
        user.disconnectTimer = setTimeout(() => {
            users.delete(user.id);
            sockets.delete(socket.id);

            broadcast(io);
        }, diconnectTimeout);
    });
}

function broadcast(io) {
    io.emit('info', users.size);
}

export { registerChatSocket }
