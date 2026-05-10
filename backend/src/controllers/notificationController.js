import { ApiError } from "../utils/ApiError.js";
import {
  addNotification,
  fetchNotifications,
} from "../services/notificationService.js";

export async function listNotifications(_req, res) {
  const data = await fetchNotifications();
  res.json({ success: true, data });
}

export async function createNotification(req, res) {
  const { title, message } = req.body;
  if (!title || !message) {
    throw new ApiError(400, "title and message are required");
  }
  const data = await addNotification(req.body);
  res.status(201).json({ success: true, data });
}
