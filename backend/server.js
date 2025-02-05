const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI);
const path = require('path');


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

    socket.on("message", (data) => {
        console.log(`Message received: ${data}`);
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));