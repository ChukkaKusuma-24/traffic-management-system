import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { mockJunctions, mockUsers } from "../src/seed/mockData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required for prisma seed");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const SIGNAL_COLORS = ["RED", "YELLOW", "GREEN"];
const INCIDENT_SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const INCIDENT_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED"];
const EMERGENCY_TYPES = ["AMBULANCE", "FIRE", "POLICE", "DISASTER"];
const NOTIFICATION_CHANNELS = ["IN_APP", "SMS", "EMAIL"];
const HEALTH_STATUSES = ["HEALTHY", "DEGRADED", "CRITICAL"];
const SERVICE_NAMES = ["traffic-core-api", "signal-engine", "incident-service", "ai-prediction-engine"];

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

function randomPick(items) {
  return items[randomInt(0, items.length - 1)];
}

function randomTimestampWithinHours(hoursBack) {
  const now = Date.now();
  const windowMs = hoursBack * 60 * 60 * 1000;
  return new Date(now - randomInt(5 * 60 * 1000, windowMs));
}

async function main() {
  await prisma.notification.deleteMany();
  await prisma.emergencyRoute.deleteMany();
  await prisma.emergencyEvent.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.signalState.deleteMany();
  await prisma.trafficPrediction.deleteMany();
  await prisma.trafficLog.deleteMany();
  await prisma.systemHealthMetric.deleteMany();
  await prisma.junction.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD ?? "password123";
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  await Promise.all(
    mockUsers.map((user) =>
      prisma.user.create({
        data: { ...user, passwordHash },
      })
    )
  );

  const allUsers = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const junctions = await Promise.all(
    mockJunctions.map((junction) =>
      prisma.junction.create({
        data: junction,
      })
    )
  );

  const trafficLogsBatch = [];
  const predictionsBatch = [];
  const signalStatesBatch = [];

  for (const junction of junctions) {
    for (let i = 0; i < 24; i += 1) {
      trafficLogsBatch.push({
        junctionId: junction.id,
        vehicleCount: randomInt(65, 480),
        averageSpeedKmph: Number(randomInRange(12, 58).toFixed(2)),
        congestionLevel: Number(randomInRange(0.12, 0.98).toFixed(2)),
        recordedAt: new Date(Date.now() - (24 - i) * 10 * 60 * 1000),
      });
    }

    for (let horizon = 1; horizon <= 6; horizon += 1) {
      predictionsBatch.push({
        junctionId: junction.id,
        predictedCongestion: Number(randomInRange(0.15, 0.95).toFixed(2)),
        predictedVehicleCount: randomInt(75, 520),
        confidenceScore: Number(randomInRange(0.68, 0.99).toFixed(2)),
        predictedFor: new Date(Date.now() + horizon * 30 * 60 * 1000),
      });
    }

    for (let change = 0; change < 4; change += 1) {
      const changedBy = allUsers[randomInt(0, allUsers.length - 1)];
      signalStatesBatch.push({
        junctionId: junction.id,
        changedById: changedBy.id,
        currentColor: randomPick(SIGNAL_COLORS),
        cycleTimeSec: randomInt(35, 140),
        effectiveFrom: new Date(Date.now() - (4 - change) * 20 * 60 * 1000),
      });
    }
  }

  await prisma.trafficLog.createMany({ data: trafficLogsBatch });
  await prisma.trafficPrediction.createMany({ data: predictionsBatch });
  await prisma.signalState.createMany({ data: signalStatesBatch });

  const incidents = [];
  for (let i = 0; i < 10; i += 1) {
    const incident = await prisma.incident.create({
      data: {
        junctionId: junctions[randomInt(0, junctions.length - 1)].id,
        reportedById: allUsers[randomInt(0, allUsers.length - 1)].id,
        title: `Traffic Incident #${i + 1}`,
        description:
          i % 2 === 0
            ? "Detected sustained vehicle queue buildup and abrupt slowdown."
            : "Manual report from control room about unsafe lane obstruction.",
        severity: randomPick(INCIDENT_SEVERITIES),
        status: randomPick(INCIDENT_STATUSES),
        occurredAt: randomTimestampWithinHours(36),
        resolvedAt: i % 3 === 0 ? new Date(Date.now() - randomInt(10, 180) * 60 * 1000) : null,
      },
    });
    incidents.push(incident);
  }

  const emergencyEvents = [];
  for (let i = 0; i < 6; i += 1) {
    const relatedIncident = incidents[randomInt(0, incidents.length - 1)];
    const emergencyEvent = await prisma.emergencyEvent.create({
      data: {
        incidentId: relatedIncident.id,
        triggeredById: allUsers[randomInt(0, allUsers.length - 1)].id,
        type: randomPick(EMERGENCY_TYPES),
        priority: randomInt(1, 5),
        description: "Priority corridor activation triggered for emergency fleet movement.",
        startedAt: randomTimestampWithinHours(24),
        endedAt: i % 2 === 0 ? new Date(Date.now() - randomInt(5, 90) * 60 * 1000) : null,
      },
    });
    emergencyEvents.push(emergencyEvent);
  }

  for (const emergencyEvent of emergencyEvents) {
    const chosenJunctions = junctions
      .map((junction) => ({ junction, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .slice(0, 3)
      .map((entry) => entry.junction);

    await prisma.emergencyRoute.createMany({
      data: chosenJunctions.map((junction, index) => ({
        emergencyEventId: emergencyEvent.id,
        junctionId: junction.id,
        routeOrder: index + 1,
        etaMinutes: randomInt(2, 12),
        isCleared: index < randomInt(0, 1),
      })),
    });
  }

  const notificationsBatch = [];
  for (const user of allUsers) {
    for (let i = 0; i < 6; i += 1) {
      notificationsBatch.push({
        recipientId: user.id,
        title: i % 2 === 0 ? "Signal cycle updated" : "Incident escalation alert",
        message:
          i % 2 === 0
            ? "Adaptive timing strategy updated based on congestion predictions."
            : "Please review and acknowledge recent high-severity incident.",
        channel: randomPick(NOTIFICATION_CHANNELS),
        isRead: i % 3 === 0,
        readAt: i % 3 === 0 ? new Date(Date.now() - randomInt(5, 120) * 60 * 1000) : null,
      });
    }
  }
  await prisma.notification.createMany({ data: notificationsBatch });

  const healthMetricsBatch = [];
  for (const service of SERVICE_NAMES) {
    for (let i = 0; i < 12; i += 1) {
      healthMetricsBatch.push({
        serviceName: service,
        status: randomPick(HEALTH_STATUSES),
        cpuUsagePercent: Number(randomInRange(18, 88).toFixed(2)),
        memoryUsagePercent: Number(randomInRange(22, 92).toFixed(2)),
        responseTimeMs: randomInt(35, 380),
        activeSocketClients: randomInt(2, 120),
        recordedAt: new Date(Date.now() - i * 5 * 60 * 1000),
      });
    }
  }
  await prisma.systemHealthMetric.createMany({ data: healthMetricsBatch });

  console.log(
    `Seed complete: ${allUsers.length} users, ${junctions.length} junctions, ${trafficLogsBatch.length} logs, ${predictionsBatch.length} predictions, ${signalStatesBatch.length} signal changes, ${incidents.length} incidents, ${emergencyEvents.length} emergencies, ${notificationsBatch.length} notifications, ${healthMetricsBatch.length} health metrics. Default password: ${defaultPassword}`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
