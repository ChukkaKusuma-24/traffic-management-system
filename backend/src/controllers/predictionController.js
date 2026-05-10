import { fetchPredictions } from "../services/predictionService.js";

export async function getPredictions(_req, res) {
  const data = await fetchPredictions();
  res.json({ success: true, data });
}
