import { Router } from "express";
import { getPredictions } from "../controllers/predictionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const predictionsRouter = Router();

predictionsRouter.get("/", asyncHandler(getPredictions));
