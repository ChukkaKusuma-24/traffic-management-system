import { prisma } from "../config/prisma.js";

export async function fetchSystemHealth() {
  return prisma.systemHealthMetric.findMany({
    orderBy: { recordedAt: "desc" },
    take: 50,
  });
}
