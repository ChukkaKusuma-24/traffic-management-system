import { Router } from "express";
import { createJunction, listJunctions } from "../controllers/junctionController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const junctionRouter = Router();

junctionRouter.get("/", asyncHandler(listJunctions));
junctionRouter.post("/", asyncHandler(createJunction));
