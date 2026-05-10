import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export async function fetchIncidents() {
  return prisma.incident.findMany({
    include: { junction: true, emergencyEvents: true },
    orderBy: { occurredAt: "desc" },
    take: 100,
  });
}

export async function addIncident(payload) {
  return prisma.incident.create({
    data: {
      junctionId: payload.junctionId,
      reportedById: payload.reportedById,
      title: payload.title,
      description: payload.description,
      severity: payload.severity,
      occurredAt: payload.occurredAt ? new Date(payload.occurredAt) : new Date(),
      status: payload.status ?? "OPEN",
    },
  });
}

export async function markIncidentResolved(incidentId) {
  const existing = await prisma.incident.findUnique({ where: { id: incidentId } });
  if (!existing) {
    throw new ApiError(404, "Incident not found");
  }

  return prisma.incident.update({
    where: { id: incidentId },
    data: {
      status: "RESOLVED",
      resolvedAt: new Date(),
    },
  });
}
