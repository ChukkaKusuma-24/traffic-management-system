import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export function errorHandler(error, req, res, _next) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message =
    error instanceof ApiError ? error.message : "Internal server error";

  logger.error("Request failed", {
    statusCode,
    message: error.message,
    path: req.originalUrl,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    details: error instanceof ApiError ? error.details : undefined,
  });
}
