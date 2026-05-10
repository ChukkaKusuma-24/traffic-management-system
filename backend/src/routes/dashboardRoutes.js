import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const dashboardRouter = Router();

dashboardRouter.get("/stats", asyncHandler(getDashboardStats));
