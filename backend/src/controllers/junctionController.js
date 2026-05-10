import { ApiError } from "../utils/ApiError.js";
import { addJunction, fetchJunctions } from "../services/junctionService.js";

export async function listJunctions(_req, res) {
  const data = await fetchJunctions();
  res.json({ success: true, data });
}

export async function createJunction(req, res) {
  const { name, code, latitude, longitude, area } = req.body;
  if (!name || !code || latitude === undefined || longitude === undefined || !area) {
    throw new ApiError(400, "name, code, latitude, longitude, area are required");
  }
  const data = await addJunction({ name, code, latitude, longitude, area });
  res.status(201).json({ success: true, data });
}
