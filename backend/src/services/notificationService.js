import { prisma } from "../config/prisma.js";

export async function fetchNotifications() {
  return prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function addNotification(payload) {
  return prisma.notification.create({
    data: {
      recipientId: payload.recipientId,
      title: payload.title,
      message: payload.message,
      channel: payload.channel ?? "IN_APP",
    },
  });
}
