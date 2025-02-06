const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI);
const path = require('path');
const GroupMessage = require('./src/models/GroupMessage');

const app = express();

(async () => {
    try {
        await connectDB();
    } catch (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
})();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/view/user', userRoutes);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        console.log(`${username} joined room: ${room}`);

        io.to(room).emit("message", { username: "Server:", message: `${username} joined the chat` });
    });

    socket.on("leaveRoom", ({ username, room }) => {
        socket.leave(room);
        console.log(`${username} left room: ${room}`);
        io.to(room).emit("message", { username: "Server:", message: `${username} left the chat` });
    });

    socket.on("chatMessage", async ({ username, room, message }) => {
        console.log(`Message from ${username} in ${room}: ${message}`);

        const newMessage = new GroupMessage({ from_user: username, room, message });

        try {
            await newMessage.save();
            io.to(room).emit("message", { username, message });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));