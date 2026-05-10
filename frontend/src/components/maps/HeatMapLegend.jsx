import { useMemo } from "react";
import { GLASS } from "../../utils/constants";

export function HeatMapLegend({ trafficUpdates, junctions }) {
  const stats = useMemo(() => {
    if (!trafficUpdates || trafficUpdates.length === 0) {
      return {
        averageWaitingTime: 0,
        criticalJunctions: 0,
        highCongestion: 0,
        moderate: 0,
        lowCongestion: 0,
      };
    }

    const avgWait = trafficUpdates.reduce((sum, update) => sum + (update.averageWaitingTime || 0), 0) / trafficUpdates.length;
    const critical = trafficUpdates.filter((u) => u.congestionLevel > 0.75).length;
    const high = trafficUpdates.filter((u) => u.congestionLevel > 0.5 && u.congestionLevel <= 0.75).length;
    const moderate = trafficUpdates.filter((u) => u.congestionLevel >= 0.25 && u.congestionLevel <= 0.5).length;
    const low = trafficUpdates.filter((u) => u.congestionLevel < 0.25).length;

    return {
      averageWaitingTime: Math.round(avgWait),
      criticalJunctions: critical,
      highCongestion: high,
      moderate,
      lowCongestion: low,
    };
  }, [trafficUpdates]);

  return (
    <div className={`${GLASS} p-4`}>
      <h3 className="mb-4 text-sm font-semibold text-cyan-200">Traffic Intensity Legend</h3>

      <div className="space-y-3">
        {/* Critical */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-red-500" />
            <span className="text-sm text-slate-300">Critical (75-100%)</span>
          </div>
          <span className="text-xs font-semibold text-red-400">{stats.criticalJunctions} zones</span>
        </div>

        {/* High */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-300">High (50-75%)</span>
          </div>
          <span className="text-xs font-semibold text-amber-400">{stats.highCongestion} zones</span>
        </div>

        {/* Moderate */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
            <span className="text-sm text-slate-300">Moderate (25-50%)</span>
          </div>
          <span className="text-xs font-semibold text-yellow-400">{stats.moderate} zones</span>
        </div>

        {/* Low */}
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-green-500" />
            <span className="text-sm text-slate-300">Low (0-25%)</span>
          </div>
          <span className="text-xs font-semibold text-green-400">{stats.lowCongestion} zones</span>
        </div>

        {/* Average Waiting Time */}
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between rounded-lg bg-cyan-500/10 p-3">
            <span className="text-sm font-semibold text-cyan-200">Avg. Waiting Time</span>
            <span className="text-lg font-bold text-cyan-300">{stats.averageWaitingTime}s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
