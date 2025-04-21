require("dotenv").config();
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const getReceiverSocketId = (userId) => {
  return onlineUsers[userId];
};

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers[userId] = socket.id;
  }

  console.log("ova", onlineUsers);

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("sendNotification", ({ senderId, receiverId }) => {
    io.to(receiverId).emit("getNotification", { senderId });
  });

  socket.on("disconnect", () => {
    console.log("a user has disconeccted");
    delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

module.exports = { io, app, server, getReceiverSocketId };
