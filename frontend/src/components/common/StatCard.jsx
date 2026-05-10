import { GlassCard } from "./GlassCard";

export function StatCard({ label, value, trend }) {
  return (
    <GlassCard className="h-full">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {trend ? <p className="mt-2 text-xs text-cyan-200">{trend}</p> : null}
    </GlassCard>
  );
}
