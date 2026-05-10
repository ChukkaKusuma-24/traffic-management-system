import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../");

dotenv.config({ path: path.join(backendRoot, ".env") });

const clientUrls = (process.env.CLIENT_URLS ?? process.env.CLIENT_URL ?? "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  clientUrl: process.env.CLIENT_URL ?? clientUrls[0],
  clientUrls,
  databaseUrl: process.env.DATABASE_URL ?? "",
  logLevel: process.env.LOG_LEVEL ?? "info",
  simulatorEnabled: (process.env.SIMULATOR_ENABLED ?? "true") === "true",
  simulatorIntervalMs: Number(process.env.SIMULATOR_INTERVAL_MS ?? 5000),
};
