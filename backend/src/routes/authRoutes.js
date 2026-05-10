import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getMe, login, signup, updateProfile } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/login", asyncHandler(login));
authRouter.post("/signup", asyncHandler(signup));
authRouter.get("/me", authenticateToken, asyncHandler(getMe));
authRouter.patch("/profile", authenticateToken, asyncHandler(updateProfile));
