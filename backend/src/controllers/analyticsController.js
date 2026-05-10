import { fetchAnalytics } from "../services/analyticsService.js";

export async function getAnalytics(_req, res) {
  const data = await fetchAnalytics();
  res.json({ success: true, data });
}
