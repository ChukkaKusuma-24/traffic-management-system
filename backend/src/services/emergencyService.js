import { prisma } from "../config/prisma.js";

export async function fetchEmergencyEvents() {
  return prisma.emergencyEvent.findMany({
    include: { routes: true, incident: true },
    orderBy: { startedAt: "desc" },
    take: 100,
  });
}

export async function addEmergencyEvent(payload) {
  const routes = payload.routes ?? [];
  return prisma.emergencyEvent.create({
    data: {
      type: payload.type,
      priority: payload.priority ?? 1,
      description: payload.description,
      incidentId: payload.incidentId,
      triggeredById: payload.triggeredById,
      routes: {
        create: routes.map((route, index) => ({
          junctionId: route.junctionId,
          routeOrder: route.routeOrder ?? index + 1,
          etaMinutes: route.etaMinutes ?? 3,
          isCleared: route.isCleared ?? false,
        })),
      },
    },
    include: { routes: true },
  });
}
