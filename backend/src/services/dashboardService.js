import { prisma } from "../config/prisma.js";

export async function fetchDashboardStats() {
  const [junctionCount, openIncidents, activeEmergencies, latestLogs] =
    await Promise.all([
      prisma.junction.count({ where: { isActive: true } }),
      prisma.incident.count({ where: { status: { not: "RESOLVED" } } }),
      prisma.emergencyEvent.count({ where: { endedAt: null } }),
      prisma.trafficLog.findMany({
        orderBy: { recordedAt: "desc" },
        take: 100,
      }),
    ]);

  const averageCongestion =
    latestLogs.length === 0
      ? 0
      : latestLogs.reduce((sum, entry) => sum + entry.congestionLevel, 0) /
        latestLogs.length;

  return {
    junctionCount,
    openIncidents,
    activeEmergencies,
    averageCongestion: Number(averageCongestion.toFixed(2)),
    timestamp: new Date().toISOString(),
  };
}
