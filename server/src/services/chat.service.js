const sockets = new Map();
const users = new Map();

const DISCONNECT_TIMEOUT = 5000;

function getUserById(userId) {
    return users.get(userId) || null;
}

function getUserBySocketId(socketId) {
    const userId = sockets.get(socketId) || null;

    if (userId === null)
        return null;

    return getUserById(userId);
}

function getOnlineCount() {
    return users.size;
}

function joinUser(user, socketId) {
    let existing = getUserById(user.id);

    if (existing !== null) {
        clearDisconnectTimer(existing);
        removeSocket(existing.socketId);

        existing.socketId = socketId;
        existing.online = true;
    } else {
        users.set(user.id, {
            id: user.id,
            name: user.name,
            socketId: socketId,
            online: true,
            disconnectTimer: null
        });
    }

    sockets.set(socketId, user.id);
}

function removeUser(userId) {
    users.delete(userId);
}

function removeSocket(socketId) {
    sockets.delete(socketId);
}

function leaveUser(socketId) {
    const user = getUserBySocketId(socketId);

    if (user === null)
        return;

    clearDisconnectTimer(user);

    removeUser(user.id);
    removeSocket(socketId)
}

function handleDisconnect(socketId, timeoutCallback) {
    const user = getUserBySocketId(socketId)

    if (user === null)
        return;

    user.online = false;

    user.disconnectTimer = setTimeout(() => {
        removeUser(user.id);
        removeSocket(socketId);

        if (timeoutCallback) {
            timeoutCallback();
        }

    }, DISCONNECT_TIMEOUT);
}

function clearDisconnectTimer(user) {
    if (user.disconnectTimer) {
        clearTimeout(user.disconnectTimer);
        user.disconnectTimer = null;
    }
}

export {
    joinUser,
    leaveUser,
    getOnlineCount,
    handleDisconnect
};
