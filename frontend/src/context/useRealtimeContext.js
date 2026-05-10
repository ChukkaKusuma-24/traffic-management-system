import { useContext } from "react";
import { RealtimeContext } from "./RealtimeContext";

export function useRealtimeContext() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtimeContext must be used within RealtimeProvider");
  }
  return context;
}
