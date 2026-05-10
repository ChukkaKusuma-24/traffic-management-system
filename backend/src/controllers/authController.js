import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { createUser, validateUserCredentials, updateUserProfile } from "../services/authService.js";

const JWT_SECRET = process.env.JWT_SECRET || "traffic-secret";
const JWT_EXPIRES_IN = "7d";

function buildUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function signup(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Missing registration fields.");
  }

  const user = await createUser({ name, email, password, role });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(201).json({
    success: true,
    data: {
      user: buildUserPayload(user),
      token,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await validateUserCredentials(email, password);
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.json({
    success: true,
    data: {
      user: buildUserPayload(user),
      token,
    },
  });
}

export async function getMe(req, res) {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Not authenticated.");
  }

  res.json({ success: true, data: { user: buildUserPayload(user) } });
}

export async function updateProfile(req, res) {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Not authenticated.");
  }

  const { name, email } = req.body;
  if (!name || !email) {
    throw new ApiError(400, "Name and email are required.");
  }

  const updated = await updateUserProfile(user.id, { name, email });
  res.json({ success: true, data: { user: buildUserPayload(updated) } });
}
