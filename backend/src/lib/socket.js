import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";

const app = express();

// 🔴 IMPORTANT: enable CORS with credentials on EXPRESS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// used to store online users
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
