import { ApiError } from "../utils/ApiError.js";
import { addEmergencyEvent, fetchEmergencyEvents } from "../services/emergencyService.js";

export async function listEmergencyEvents(_req, res) {
  const data = await fetchEmergencyEvents();
  res.json({ success: true, data });
}

export async function createEmergencyEvent(req, res) {
  const { type, description, priority, incidentId, triggeredById, routes } = req.body;
  if (!type || !description) {
    throw new ApiError(400, "type and description are required");
  }

  const data = await addEmergencyEvent({
    type,
    description,
    priority,
    incidentId,
    triggeredById,
    routes,
  });
  req.app.get("io").emit("emergency-alert", data);
  res.status(201).json({ success: true, data });
}
