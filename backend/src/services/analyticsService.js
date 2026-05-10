import { prisma } from "../config/prisma.js";

export async function fetchAnalytics() {
  const logs = await prisma.trafficLog.findMany({
    orderBy: { recordedAt: "desc" },
    take: 200,
  });

  const totals = logs.reduce(
    (acc, log) => {
      acc.vehicleCount += log.vehicleCount;
      acc.averageSpeed += log.averageSpeedKmph;
      acc.congestion += log.congestionLevel;
      return acc;
    },
    { vehicleCount: 0, averageSpeed: 0, congestion: 0 }
  );

  const divisor = logs.length || 1;

  return {
    sampleSize: logs.length,
    vehiclesObserved: totals.vehicleCount,
    averageSpeedKmph: Number((totals.averageSpeed / divisor).toFixed(2)),
    averageCongestion: Number((totals.congestion / divisor).toFixed(2)),
  };
}
