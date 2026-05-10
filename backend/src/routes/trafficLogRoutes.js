import { Router } from "express";
import { listTrafficLogs } from "../controllers/trafficLogController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const trafficLogsRouter = Router();

trafficLogsRouter.get("/", asyncHandler(listTrafficLogs));
