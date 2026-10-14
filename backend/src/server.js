import express from 'express';
import { Server } from 'socket.io';

const port = 3000;
const app = express();

app.use(express.static('public'));

const server = app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

const io = new Server(server);

const sockets = new Map();
const users = new Map();

io.on('connection', (socket) => {

    socket.emit('info', users.size);

    socket.on('join', (user) => {

        var existing = users.get(user.id);

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

        broadcast();
    });

    socket.on('leave', () => {
        const userId = sockets.get(socket.id);

        if (!userId) 
            return;

        users.delete(userId);
        sockets.delete(socket.id);

        broadcast();
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

            broadcast();
        }, 5000);
    });
});

function broadcast() {
    io.emit('info', users.size);
}
