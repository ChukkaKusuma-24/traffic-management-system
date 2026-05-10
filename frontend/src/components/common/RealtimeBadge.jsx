import { useRealtimeContext } from "../../context/useRealtimeContext";

export function RealtimeBadge() {
  const { connected } = useRealtimeContext();
  return (
    <div
      className={`rounded-full border px-3 py-1 text-xs ${
        connected
          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
          : "border-rose-500/50 bg-rose-500/10 text-rose-300"
      }`}
    >
      {connected ? "Realtime Connected" : "Realtime Disconnected"}
    </div>
  );
}
