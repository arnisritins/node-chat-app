(function() {

    const socket = io();

    const USER_STORAGE_KEY = "user";

    const userForm = document.getElementById('user-form');
    const userProfile = document.getElementById('user-profile');

    const input = document.getElementById('join-name');
    const joinBtn = document.getElementById('join-btn');
    const leaveBtn = document.getElementById('leave-btn');

    let user = getCurrentUser();

    render();

    joinBtn.addEventListener("click", joinChat);
    leaveBtn.addEventListener("click", leaveChat);

    socket.on('info', (count) => {
        updateCount(count);
    });

    socket.on('connect', () => {
        updateStatus(1);

        if (user !== null) {
            socket.emit('join', user);
        }
    });

    socket.on('disconnect', () => {
        updateStatus(-1);
    });


    function joinChat(e) {
        e.preventDefault();

        let name = input.value.trim();

        if (name) {
            user = {
                id: crypto.randomUUID(),
                name: name,
            };

            input.value = '';

            storeUser();
            render();

            socket.emit('join', user);
        }
    }

    function leaveChat(e) {
        e.preventDefault();

        user = null;
        clearUser();

        socket.emit('leave');

        render();
    }

    function render() {
        if (user) {
            document.getElementById('user-name').textContent = user.name;

            userForm.style.display = 'none';
            userProfile.style.display = 'block';
            
        } else {
            userForm.style.display = 'block';
            userProfile.style.display = 'none';
        }
    }

    function updateStatus(status) {
        const elem = document.getElementById('status');

        switch (status) {
            case 1:
                elem.innerText = 'Connected';
                break;
            case -1:
                elem.innerText = 'Disconnected';
                break;
            default:
                elem.innerText = 'Connecting...';
        }
    }

    function updateCount(count) {
        document.getElementById('users-online').textContent = count;
    }

    function getCurrentUser() {
        let data = localStorage.getItem(USER_STORAGE_KEY);

        if (data) {
            return JSON.parse(data);
        }

        return null;
    }

    function storeUser() {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }
    }

    function clearUser() {
        localStorage.removeItem(USER_STORAGE_KEY);
    }

})();
