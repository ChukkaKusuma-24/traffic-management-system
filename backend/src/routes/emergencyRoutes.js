import { Router } from "express";
import { createEmergencyEvent, listEmergencyEvents } from "../controllers/emergencyController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const emergencyRouter = Router();

emergencyRouter.get("/", asyncHandler(listEmergencyEvents));
emergencyRouter.post("/", asyncHandler(createEmergencyEvent));
