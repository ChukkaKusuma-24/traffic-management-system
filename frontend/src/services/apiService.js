import { apiClient } from "./apiClient";

export const apiService = {
  getDashboardStats: async () => (await apiClient.get("/dashboard/stats")).data.data,
  getJunctions: async () => (await apiClient.get("/junctions")).data.data,
  getTrafficLogs: async () => (await apiClient.get("/traffic/logs?limit=100")).data.data,
  getAnalytics: async () => (await apiClient.get("/analytics")).data.data,
  getPredictions: async () => (await apiClient.get("/predictions")).data.data,
  getSystemHealth: async () => (await apiClient.get("/system-health")).data.data,
  getIncidents: async () => (await apiClient.get("/incidents")).data.data,
  createIncident: async (payload) => (await apiClient.post("/incidents", payload)).data.data,
  getEmergencyEvents: async () => (await apiClient.get("/emergency")).data.data,
  createEmergencyEvent: async (payload) =>
    (await apiClient.post("/emergency", payload)).data.data,
  getNotifications: async () => (await apiClient.get("/notifications")).data.data,
};
