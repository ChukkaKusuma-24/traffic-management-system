import { ApiError } from "../utils/ApiError.js";
import {
  addIncident,
  fetchIncidents,
  markIncidentResolved,
} from "../services/incidentService.js";

export async function listIncidents(_req, res) {
  const data = await fetchIncidents();
  res.json({ success: true, data });
}

export async function createIncident(req, res) {
  const { junctionId, title, description, severity } = req.body;
  if (!junctionId || !title || !description || !severity) {
    throw new ApiError(400, "junctionId, title, description, severity are required");
  }

  const data = await addIncident(req.body);
  req.app.get("io").emit("incident-report", data);
  res.status(201).json({ success: true, data });
}

export async function resolveIncident(req, res) {
  const incidentId = req.params.incidentId;
  if (!incidentId) {
    throw new ApiError(400, "incidentId is required");
  }

  const data = await markIncidentResolved(incidentId);
  res.json({ success: true, data });
}
