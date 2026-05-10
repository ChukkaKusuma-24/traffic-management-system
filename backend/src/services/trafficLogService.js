import { prisma } from "../config/prisma.js";

export async function fetchTrafficLogs({ limit = 100, junctionId }) {
  return prisma.trafficLog.findMany({
    where: junctionId ? { junctionId } : undefined,
    include: { junction: true },
    orderBy: { recordedAt: "desc" },
    take: limit,
  });
}
