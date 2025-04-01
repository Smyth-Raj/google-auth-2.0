const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const users = {}; // Store connected users

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store user with their socket ID
  socket.on("register", (username) => {
    users[username] = socket.id;
    console.log(`${username} registered with ID ${socket.id}`);
  });

  // Handle message sending
  socket.on("sendMessage", ({ sender, receiver, message }) => {
    const receiverSocketId = users[receiver];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", { sender, message });
    } else {
      console.log(`User ${receiver} is not online.`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    Object.keys(users).forEach((key) => {
      if (users[key] === socket.id) delete users[key];
    });
  });
});

server.listen(3000, () => {
  console.log("WebSocket Server running on http://localhost:3000");
});
