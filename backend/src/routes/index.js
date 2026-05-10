import { Router } from "express";
import { analyticsRouter } from "./analyticsRoutes.js";
import { authRouter } from "./authRoutes.js";
import { dashboardRouter } from "./dashboardRoutes.js";
import { emergencyRouter } from "./emergencyRoutes.js";
import { incidentsRouter } from "./incidentRoutes.js";
import { junctionRouter } from "./junctionRoutes.js";
import { notificationsRouter } from "./notificationRoutes.js";
import { predictionsRouter } from "./predictionRoutes.js";
import { systemHealthRouter } from "./systemHealthRoutes.js";
import { trafficLogsRouter } from "./trafficLogRoutes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/junctions", junctionRouter);
apiRouter.use("/traffic/logs", trafficLogsRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/predictions", predictionsRouter);
apiRouter.use("/emergency", emergencyRouter);
apiRouter.use("/incidents", incidentsRouter);
apiRouter.use("/system-health", systemHealthRouter);
apiRouter.use("/notifications", notificationsRouter);
