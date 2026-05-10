import { fetchTrafficLogs } from "../services/trafficLogService.js";

export async function listTrafficLogs(req, res) {
  const limit = Number(req.query.limit ?? 100);
  const junctionId = req.query.junctionId ? String(req.query.junctionId) : undefined;
  const data = await fetchTrafficLogs({ limit, junctionId });
  res.json({ success: true, data });
}
