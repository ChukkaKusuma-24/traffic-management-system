import { apiClient } from "./apiClient";

export const authService = {
  login: async ({ email, password }) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data.data;
  },
  signup: async ({ name, email, password, role }) => {
    const response = await apiClient.post("/auth/signup", { name, email, password, role });
    return response.data.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },
  updateProfile: async (updates) => {
    const response = await apiClient.patch("/auth/profile", updates);
    return response.data.data;
  },
};
