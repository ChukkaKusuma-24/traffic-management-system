import { Server } from "socket.io";
import { registerSocketEvents } from "./events.js";

function isAllowedSocketOrigin(origin, clientUrls, nodeEnv) {
  if (!origin || clientUrls.includes(origin)) return true;
  if (nodeEnv !== "production") {
    return /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+):\d+$/.test(origin);
  }
  return false;
}

export function initializeSocketServer(httpServer, clientUrls, nodeEnv = "development") {
  const io = new Server(httpServer, {
    cors: {
      origin(origin, callback) {
        if (isAllowedSocketOrigin(origin, clientUrls, nodeEnv)) {
          return callback(null, true);
        }
        return callback(new Error("Socket origin not allowed"));
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.emit("system:connected", { id: socket.id });
    registerSocketEvents(io, socket);
  });

  return io;
}
