// src/config/config.io.js
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const ioHelper = require("../utils/ioHelper");

const initSocket = (server) => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://crm.fab5connect.com",
    "https://fab5connect.com",
    "http://localhost:5173",
    "https://fab-5-crm.vercel.app",
    "http://localhost:5174",
  ].filter(Boolean);

  const io = socketIO(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    let token = socket.handshake.auth?.token;

    if (!token && socket.handshake.headers?.cookie) {
      const parts = socket.handshake.headers.cookie.split('token=');
      if (parts.length > 1) {
        token = parts[1].split(';')[0];
      }
    }

    if (!token) return next(new Error("Authentication error"));

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded; 
      next();
    });
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id || socket.user._id;
    
    if (socket.user.role === "admin" || socket.user.role === "owner") {
      socket.join("room:admin");
    } else if (socket.user.role === "employee" && userId) {
      socket.join(`room:employee:${userId}`);
    }
  });

  ioHelper.init(io);
  global.io = io;
  return io;
};

module.exports = initSocket;