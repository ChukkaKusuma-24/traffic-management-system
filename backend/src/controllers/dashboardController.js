import { fetchDashboardStats } from "../services/dashboardService.js";

export async function getDashboardStats(_req, res) {
  const data = await fetchDashboardStats();
  res.json({ success: true, data });
}
