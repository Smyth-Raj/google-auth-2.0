const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Store connected users
const users = {};

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // User registration event
    socket.on("register", (username) => {
        users[username] = socket.id;
        console.log(`User registered: ${username}`);
    });

    // Handling messages
    socket.on("sendMessage", ({ sender, receiver, message }) => {
        console.log(`${sender} to ${receiver}: ${message}`);

        if (users[receiver]) {
            io.to(users[receiver]).emit("receiveMessage", { sender, message });
        }
    });

    // User disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        Object.keys(users).forEach((user) => {
            if (users[user] === socket.id) delete users[user];
        });
    });
});

server.listen(3000, () => console.log("Chat microservice running on port 3000"));
