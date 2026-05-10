import { logger } from "./logger.js";

const SIGNALS = ["RED", "YELLOW", "GREEN"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function startTrafficSimulator({ io, prisma, enabled, intervalMs }) {
  if (!enabled) {
    logger.info("Traffic simulator disabled");
    return () => {};
  }

  let timer = setInterval(async () => {
    try {
      const junctions = await prisma.junction.findMany({
        where: { isActive: true },
        take: 20,
      });

      if (junctions.length === 0) {
        return;
      }

      const junction = randomPick(junctions);
      const logPayload = {
        junctionId: junction.id,
        vehicleCount: randomInt(50, 450),
        averageSpeedKmph: Number(randomBetween(15, 60).toFixed(2)),
        congestionLevel: Number(randomBetween(0.1, 0.98).toFixed(2)),
      };

      const trafficLog = await prisma.trafficLog.create({ data: logPayload });
      io.emit("traffic-update", {
        junctionId: junction.id,
        junctionName: junction.name,
        ...logPayload,
        recordedAt: trafficLog.recordedAt,
      });

      if (Math.random() > 0.55) {
        const signalState = await prisma.signalState.create({
          data: {
            junctionId: junction.id,
            currentColor: randomPick(SIGNALS),
            cycleTimeSec: randomInt(45, 120),
          },
        });
        io.emit("signal-change", signalState);
      }

      const healthMetric = await prisma.systemHealthMetric.create({
        data: {
          serviceName: "traffic-core-api",
          status: "HEALTHY",
          cpuUsagePercent: Number(randomBetween(25, 70).toFixed(2)),
          memoryUsagePercent: Number(randomBetween(35, 78).toFixed(2)),
          responseTimeMs: randomInt(45, 180),
          activeSocketClients: io.engine.clientsCount,
        },
      });
      io.emit("system-health-update", healthMetric);

      io.emit("junction-status-update", {
        junctionId: junction.id,
        congestionLevel: logPayload.congestionLevel,
        averageSpeedKmph: logPayload.averageSpeedKmph,
      });

      if (Math.random() > 0.82) {
        const incident = await prisma.incident.create({
          data: {
            junctionId: junction.id,
            title: "Auto-detected congestion anomaly",
            description: "Simulator raised probable incident due to sudden slowdown.",
            severity: "MEDIUM",
            status: "OPEN",
            occurredAt: new Date(),
          },
        });
        io.emit("incident-report", incident);
      }

      if (Math.random() > 0.9) {
        const emergency = await prisma.emergencyEvent.create({
          data: {
            type: "AMBULANCE",
            priority: 1,
            description: "Mock emergency vehicle route optimization triggered.",
          },
        });
        io.emit("emergency-alert", emergency);
      }
    } catch (error) {
      logger.error("Traffic simulator loop failed", { message: error.message });
    }
  }, intervalMs);

  logger.info("Traffic simulator started", { intervalMs });

  return () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      logger.info("Traffic simulator stopped");
    }
  };
}
