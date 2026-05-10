import { prisma } from "../config/prisma.js";

export async function fetchPredictions() {
  return prisma.trafficPrediction.findMany({
    include: { junction: true },
    orderBy: { predictedFor: "asc" },
    take: 100,
  });
}
