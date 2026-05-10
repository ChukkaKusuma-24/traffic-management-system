import { env } from "../config/env.js";

const LEVELS = ["debug", "info", "warn", "error"];
const currentLevelIndex = LEVELS.indexOf(env.logLevel);

function shouldLog(level) {
  const index = LEVELS.indexOf(level);
  return index >= Math.max(currentLevelIndex, 0);
}

function log(level, message, meta = {}) {
  if (!shouldLog(level)) {
    return;
  }

  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  console[level === "debug" ? "log" : level](JSON.stringify(payload));
}

export const logger = {
  debug: (message, meta) => log("debug", message, meta),
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};
