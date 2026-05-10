import { Router } from "express";
import { getSystemHealth } from "../controllers/systemHealthController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const systemHealthRouter = Router();

systemHealthRouter.get("/", asyncHandler(getSystemHealth));
