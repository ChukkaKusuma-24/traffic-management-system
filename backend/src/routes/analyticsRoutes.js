import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const analyticsRouter = Router();

analyticsRouter.get("/", asyncHandler(getAnalytics));
