import { useMemo } from "react";
import { useRealtimeContext } from "../context/useRealtimeContext";

export function useRealtimeEvent(eventKey) {
  const context = useRealtimeContext();
  return useMemo(() => context[eventKey] ?? [], [context, eventKey]);
}
