class ChatStore {
    #users = new Map();
    #sockets = new Map();

    getUserById(userId) {
        return this.#users.get(userId) || null;
    }

    getUserBySocketId(socketId) {
        const userId = this.#sockets.get(socketId) || null;
    
        if (userId === null)
            return null;
    
        return this.getUserById(userId);
    }
    
    getUsersCount() {
        return this.#users.size;
    }

    upsertUser(user) {
        this.#users.set(user.id, user);
        this.#sockets.set(user.socketId, user.id);
    }

    removeUser(user) {
        this.#users.delete(user.id);
        this.#sockets.delete(user.socketId);
    }

    removeSocket(socketId) {
        this.#sockets.delete(socketId);
    }
}

export const chatStore = new ChatStore();
