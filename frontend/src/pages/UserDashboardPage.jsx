import { useMemo, useState } from "react";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { GlassCard } from "../components/common/GlassCard";
import { IncidentReportModal } from "../components/common/IncidentReportModal";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SearchFilterBar } from "../components/common/SearchFilterBar";
import { StatCard } from "../components/common/StatCard";
import { CityHeatMap } from "../components/maps/CityHeatMap";
import { HeatMapLegend } from "../components/maps/HeatMapLegend";
import { useRealtimeContext } from "../context/useRealtimeContext";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { formatPercent } from "../utils/formatters";

export function UserDashboardPage() {
  const { loading, error, bootstrap, trafficUpdates, junctionStatusUpdates } = useRealtimeContext();
  const [selectedJunction, setSelectedJunction] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedForReport, setSelectedForReport] = useState(null);

  const { query, setQuery, filtered } = useSearchFilter(
    bootstrap.junctions,
    (junction) => `${junction.name} ${junction.area}`
  );

  const summary = useMemo(() => {
    const activeJunctions = bootstrap.junctions.length;
    const averageCongestion =
      junctionStatusUpdates.length === 0
        ? 0
        : junctionStatusUpdates.reduce((sum, item) => sum + item.congestionLevel, 0) /
          junctionStatusUpdates.length;
    return { activeJunctions, averageCongestion };
  }, [bootstrap.junctions, junctionStatusUpdates]);

  const junctionTableData = useMemo(
    () =>
      filtered.map((j) => {
        const status = trafficUpdates.find((u) => u.junctionId === j.id);
        return {
          id: j.id,
          name: j.name,
          area: j.area,
          congestion: status?.congestionLevel ?? 0,
          waitingTime: status?.averageWaitingTime ?? 0,
          status: (status?.congestionLevel ?? 0) > 0.7 ? "Heavy" : "Normal",
        };
      }),
    [filtered, trafficUpdates]
  );

  const handleReportClick = (junction) => {
    setSelectedForReport(junction);
    setIsReportModalOpen(true);
  };

  if (loading) return <LoadingSpinner label="Loading traffic status..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      {/* Key Stats - Simplified for Users */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Active Routes" value={summary.activeJunctions} trend="monitored junctions" />
        <StatCard
          label="Avg. Traffic Level"
          value={formatPercent(summary.averageCongestion)}
          trend="city-wide average"
        />
      </div>

      {/* Map with Legend */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassCard title="Live Traffic Map">
            <CityHeatMap junctions={bootstrap.junctions} trafficUpdates={trafficUpdates} />
          </GlassCard>
        </div>
        <div>
          <HeatMapLegend trafficUpdates={trafficUpdates} junctions={bootstrap.junctions} />
        </div>
      </div>

      {/* Junction Status Table */}
      <GlassCard title="Junction Status">
        <SearchFilterBar query={query} setQuery={setQuery} placeholder="Search routes..." />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-2 font-semibold text-cyan-200">Route</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Area</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Traffic Level</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Wait Time</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {junctionTableData.map((row) => (
                <tr key={row.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                  <td className="px-4 py-3 text-slate-300">{row.area}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                        row.congestion > 0.75
                          ? "bg-red-500/20 text-red-300"
                          : row.congestion > 0.5
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {formatPercent(row.congestion)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{row.waitingTime}s</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleReportClick(row)}
                      className="rounded bg-cyan-600/30 px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-600/50"
                    >
                      Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        junctionId={selectedForReport?.id}
        junctionName={selectedForReport?.name}
      />
    </div>
  );
}
