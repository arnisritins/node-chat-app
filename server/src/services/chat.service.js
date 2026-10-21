import { chatStore as store } from '../stores/chat.store.js';

const DISCONNECT_TIMEOUT = 5000;

function getUsersOnline() {
    return store.getUsersCount();
}

function joinChat(user, socketId) {
    const existing = store.getUserById(user.id);

    if (existing !== null) {
        clearDisconnectTimer(existing);

        // Remove old socket on re-connect
        store.removeSocket(existing.socketId);

        existing.socketId = socketId;
        existing.online = true;

        // Re-link user with new socket
        store.upsertUser(existing);

        return;
    }

    // New user
    store.upsertUser({
        id: user.id,
        name: user.name,
        socketId: socketId,
        online: true,
        disconnectTimer: null
    });
}

function leaveChat(socketId) {
    const user = store.getUserBySocketId(socketId);

    if (user === null)
        return;

    clearDisconnectTimer(user);

    store.removeUser(user);
}

function disconnectChat(socketId, timeoutCallback) {
    const user = store.getUserBySocketId(socketId)

    if (user === null)
        return;

    user.online = false;

    user.disconnectTimer = setTimeout(() => {

        store.removeUser(user);

        if (timeoutCallback !== undefined) {
            timeoutCallback();
        }

    }, DISCONNECT_TIMEOUT);
}

function getUser(userId) {
    return store.getUserById(userId);
}

function clearDisconnectTimer(user) {
    if (user.disconnectTimer) {
        clearTimeout(user.disconnectTimer);
        user.disconnectTimer = null;
    }
}

export {
    getUser,
    getUsersOnline,
    joinChat,
    leaveChat,
    disconnectChat
};
