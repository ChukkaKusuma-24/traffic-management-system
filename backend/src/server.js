import "dotenv/config";

import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { logger } from "./utils/logger.js";
import { initializeSocketServer } from "./sockets/index.js";
import { startTrafficSimulator } from "./utils/trafficSimulator.js";

// ❌ Safety check (after dotenv is loaded)
if (!env.databaseUrl) {
  logger.error("DATABASE_URL is required before starting the backend.");
  process.exit(1);
}

// Create Express app
const app = createApp(env.clientUrls, env.nodeEnv);

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocketServer(httpServer, env.clientUrls, env.nodeEnv);

// Attach shared services
app.set("io", io);
app.set("prisma", prisma);

let stopSimulator = () => {};

// Start server
httpServer.listen(env.port, () => {
  stopSimulator = startTrafficSimulator({
    io,
    prisma,
    enabled: env.simulatorEnabled,
    intervalMs: env.simulatorIntervalMs,
  });

  logger.info("Backend server started", {
    port: env.port,
    env: env.nodeEnv,
    simulatorEnabled: env.simulatorEnabled,
  });
});

httpServer.on("error", async (error) => {
  if (error.code === "EADDRINUSE") {
    logger.error(`Port ${env.port} is already in use. Stop the other process or change PORT in backend/.env.`);
  } else {
    logger.error("HTTP server failed to start", { message: error.message });
  }

  stopSimulator();
  await prisma.$disconnect();
  process.exit(1);
});

// Graceful shutdown
async function shutdown(signal) {
  logger.warn("Shutdown signal received", { signal });

  stopSimulator();

  await prisma.$disconnect();

  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));