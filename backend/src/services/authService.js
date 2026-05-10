import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

const USER_ROLE_WHITELIST = [
  "ADMIN",
  "OPERATOR",
  "ANALYST",
  "EMERGENCY_RESPONDER",
  "TRAFFIC_POLICE",
  "USER",
];

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser({ name, email, password, role = "USER" }) {
  if (!USER_ROLE_WHITELIST.includes(role)) {
    throw new ApiError(400, "Invalid user role.");
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, "A user with that email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
    },
  });
}

export async function validateUserCredentials(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return user;
}

export async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUserProfile(id, updates) {
  const allowed = {
    name: updates.name,
    email: updates.email,
  };

  return prisma.user.update({
    where: { id },
    data: allowed,
  });
}
