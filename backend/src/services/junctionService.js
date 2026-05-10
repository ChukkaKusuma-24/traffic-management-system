import { prisma } from "../config/prisma.js";

export async function fetchJunctions() {
  return prisma.junction.findMany({
    orderBy: { name: "asc" },
  });
}

export async function addJunction(payload) {
  return prisma.junction.create({
    data: {
      name: payload.name,
      code: payload.code,
      latitude: payload.latitude,
      longitude: payload.longitude,
      area: payload.area,
    },
  });
}
