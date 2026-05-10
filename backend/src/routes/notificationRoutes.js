import { Router } from "express";
import { createNotification, listNotifications } from "../controllers/notificationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const notificationsRouter = Router();

notificationsRouter.get("/", asyncHandler(listNotifications));
notificationsRouter.post("/", asyncHandler(createNotification));
