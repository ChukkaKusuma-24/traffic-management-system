import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { getUserById } from "../services/authService.js";

const JWT_SECRET = process.env.JWT_SECRET || "traffic-secret";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token missing.");
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(payload.userId);
    if (!user) {
      throw new ApiError(401, "User not found.");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      throw new ApiError(401, "Invalid or expired auth token.");
    }
    next(error);
  }
}
