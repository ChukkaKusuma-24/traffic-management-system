import { Router } from "express";
import { createIncident, listIncidents, resolveIncident } from "../controllers/incidentController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const incidentsRouter = Router();

incidentsRouter.get("/", asyncHandler(listIncidents));
incidentsRouter.post("/", asyncHandler(createIncident));
incidentsRouter.patch("/:incidentId/resolve", asyncHandler(resolveIncident));
