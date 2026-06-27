// src/config/config.io.js
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

const initSocket = (server) => {
  // Pass the authorized client origins explicitly to Socket.io
  const io = socketIO(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://crm.fab5connect.com",
        "https://fab5connect.com",
        "https://fab-5-crm.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie?.split('token=')[1]?.split(';')[0];
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

  global.io = io;
  return io;
};

module.exports = initSocket;