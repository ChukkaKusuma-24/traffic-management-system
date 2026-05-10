import { logger } from "../utils/logger.js";

export function registerSocketEvents(io, socket) {
  logger.info("Socket client connected", { socketId: socket.id });

  socket.on("disconnect", () => {
    logger.info("Socket client disconnected", { socketId: socket.id });
  });

  socket.on("emergency:trigger", (payload) => {
    io.emit("emergency-alert", {
      source: "client",
      ...payload,
    });
  });
}
