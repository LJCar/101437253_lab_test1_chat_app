document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:5000");

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        alert("You do not have access to the server!");
        window.location.href = "login.html";
    }

    document.getElementById("username").innerText = `Logged in as: ${user.username}`;

    const roomSelect = document.getElementById("room-select");
    const joinRoomBtn = document.getElementById("join-room-btn");
    const leaveRoomBtn = document.getElementById("leave-room-btn");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const messagesList = document.getElementById("messages");

    let currentRoom = "";

    joinRoomBtn.addEventListener("click", () => {
        const room = roomSelect.value;
        if (currentRoom) {
            socket.emit("leaveRoom", { username: user.username, room: currentRoom });
        }

        socket.emit("joinRoom", { username: user.username, room });
        currentRoom = room;
        leaveRoomBtn.disabled = false;
        alert(`Joined Room: ${room}`);
    });

    leaveRoomBtn.addEventListener("click", () => {
        if (currentRoom) {
            socket.emit("leaveRoom", { username: user.username, room: currentRoom });
            alert(`Left Room: ${currentRoom}`);
            currentRoom = "";
            leaveRoomBtn.disabled = true;
        }
    });

    sendBtn.addEventListener("click", () => {
        const message = messageInput.value.trim();
        if (message && currentRoom) {
            displayMessage(user.username, message, true);
            socket.emit("chatMessage", { username: user.username, room: currentRoom, message });
            messageInput.value = "";
        }
    });

    socket.on("message", (data) => {
        if (data.username === user.username) return;
        displayMessage(data.username, data.message, false);
    });

    function displayMessage(username, message, isSender) {
        const li = document.createElement("li");
        li.innerText = `${username}: ${message}`;

        if (isSender) {
            li.style.color = "blue";
        } else {
            li.style.color = "black";
        }

        messagesList.appendChild(li);
    }

    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
});