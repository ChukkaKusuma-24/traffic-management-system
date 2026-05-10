import { useMemo, useState } from "react";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Modal } from "../components/common/Modal";
import { SearchFilterBar } from "../components/common/SearchFilterBar";
import { StatCard } from "../components/common/StatCard";
import { CityHeatMap } from "../components/maps/CityHeatMap";
import { HeatMapLegend } from "../components/maps/HeatMapLegend";
import { useRealtimeContext } from "../context/useRealtimeContext";
import { useSearchFilter } from "../hooks/useSearchFilter";
import { formatPercent } from "../utils/formatters";

export function LiveJunctionStatusPage() {
  const { loading, error, bootstrap, trafficUpdates, junctionStatusUpdates } = useRealtimeContext();
  const [selectedJunction, setSelectedJunction] = useState(null);
  const { query, setQuery, filtered } = useSearchFilter(
    bootstrap.junctions,
    (junction) => `${junction.name} ${junction.area} ${junction.code}`
  );

  const summary = useMemo(() => {
    const activeJunctions = bootstrap.junctions.length;
    const updateCount = trafficUpdates.length;
    const averageCongestion =
      junctionStatusUpdates.length === 0
        ? 0
        : junctionStatusUpdates.reduce((sum, item) => sum + item.congestionLevel, 0) /
          junctionStatusUpdates.length;
    return { activeJunctions, updateCount, averageCongestion };
  }, [bootstrap.junctions, trafficUpdates, junctionStatusUpdates]);

  if (loading) return <LoadingSpinner label="Loading live junction data..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Active Junctions" value={summary.activeJunctions} trend="city-wide nodes" />
        <StatCard label="Realtime Updates" value={summary.updateCount} trend="stream events" />
        <StatCard
          label="Average Congestion"
          value={formatPercent(summary.averageCongestion)}
          trend="latest rolling average"
        />
      </div>

      <GlassCard title="Junction Search & Filter">
        <SearchFilterBar
          query={query}
          onQueryChange={setQuery}
          placeholder="Search by name, area, or code"
        />
      </GlassCard>

      {/* Map with Legend */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassCard title="Congestion Heatmap" subtitle="Live congestion intensity across city">
            <CityHeatMap junctions={filtered} trafficUpdates={trafficUpdates} />
          </GlassCard>
        </div>
        <div>
          <HeatMapLegend trafficUpdates={trafficUpdates} junctions={bootstrap.junctions} />
        </div>
      </div>

      <GlassCard title="Live Junction List">
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "code", label: "Code" },
            { key: "area", label: "Area" },
            {
              key: "action",
              label: "Details",
              render: (row) => (
                <button
                  type="button"
                  className="rounded-md border border-cyan-400/30 px-2 py-1 text-xs text-cyan-200"
                  onClick={() => setSelectedJunction(row)}
                >
                  Open
                </button>
              ),
            },
          ]}
          rows={filtered}
        />
      </GlassCard>

      <Modal
        open={Boolean(selectedJunction)}
        title={selectedJunction?.name ?? "Junction Detail"}
        onClose={() => setSelectedJunction(null)}
      >
        {selectedJunction ? (
          <div className="space-y-2 text-sm text-slate-200">
            <p>Code: {selectedJunction.code}</p>
            <p>Area: {selectedJunction.area}</p>
            <p>Latitude: {selectedJunction.latitude}</p>
            <p>Longitude: {selectedJunction.longitude}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
