import { createContext, useEffect, useMemo, useState } from "react";
import { apiService } from "../services/apiService";
import { socketService } from "../services/socketService";
import { useAuth } from "./useAuth";

const RealtimeContext = createContext(null);

const initialState = {
  connected: false,
  trafficUpdates: [],
  signalChanges: [],
  emergencyAlerts: [],
  incidentReports: [],
  healthUpdates: [],
  junctionStatusUpdates: [],
};

export function RealtimeProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bootstrap, setBootstrap] = useState({
    junctions: [],
    analytics: null,
    predictions: [],
    systemHealth: [],
    incidents: [],
    emergencies: [],
    logs: [],
  });

  useEffect(() => {
    let active = true;
    async function loadInitialData() {
      try {
        setLoading(true);
        const requests = [
          apiService.getJunctions(),
          apiService.getAnalytics(),
          apiService.getPredictions(),
          user?.role === "TRAFFIC_POLICE" ? apiService.getSystemHealth() : Promise.resolve([]),
          apiService.getIncidents(),
          apiService.getEmergencyEvents(),
          apiService.getTrafficLogs(),
        ];

        const [junctions, analytics, predictions, systemHealth, incidents, emergencies, logs] =
          await Promise.all(requests);
        if (!active) return;
        setBootstrap({ junctions, analytics, predictions, systemHealth, incidents, emergencies, logs });
      } catch (err) {
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitialData();
    return () => {
      active = false;
    };
  }, [user?.role]);

  useEffect(() => {
    function update(eventKey) {
      return (payload) =>
        setState((prev) => ({
          ...prev,
          [eventKey]: [payload, ...prev[eventKey]].slice(0, 100),
        }));
    }

    socketService.connect();
    socketService.on("connect", () => {
      setError("");
      setState((prev) => ({ ...prev, connected: true }));
    });
    socketService.on("disconnect", () => setState((prev) => ({ ...prev, connected: false })));
    socketService.on("connect_error", (err) => setError(err.message || "Realtime channel unavailable"));
    socketService.on("traffic-update", update("trafficUpdates"));
    socketService.on("signal-change", update("signalChanges"));
    socketService.on("emergency-alert", update("emergencyAlerts"));
    socketService.on("incident-report", update("incidentReports"));
    socketService.on("system-health-update", update("healthUpdates"));
    socketService.on("junction-status-update", update("junctionStatusUpdates"));

    return () => {
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({ ...state, loading, error, bootstrap, socket: socketService }),
    [state, loading, error, bootstrap]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export { RealtimeContext };
