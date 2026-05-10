import { fetchSystemHealth } from "../services/systemHealthService.js";

export async function getSystemHealth(_req, res) {
  const data = await fetchSystemHealth();
  res.json({ success: true, data });
}
