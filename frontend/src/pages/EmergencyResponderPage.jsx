import { useCallback, useMemo, useState } from "react";
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
import { apiService } from "../services/apiService";
import { formatPercent } from "../utils/formatters";

export function EmergencyResponderPage() {
  const { loading, error, bootstrap, trafficUpdates, emergencyAlerts } = useRealtimeContext();
  const [selectedJunction, setSelectedJunction] = useState(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState("");

  const { query, setQuery, filtered } = useSearchFilter(
    bootstrap.junctions,
    (junction) => `${junction.name} ${junction.area} ${junction.code}`
  );

  const summary = useMemo(() => {
    const activeJunctions = bootstrap.junctions.length;
    const emergencyCount = emergencyAlerts.length;
    const criticalJunctions = trafficUpdates.filter((u) => u.congestionLevel > 0.75).length;

    return { activeJunctions, emergencyCount, criticalJunctions };
  }, [bootstrap.junctions, emergencyAlerts, trafficUpdates]);

  const junctionTableData = useMemo(
    () =>
      filtered.map((j) => {
        const status = trafficUpdates.find((u) => u.junctionId === j.id);
        const isCritical = (status?.congestionLevel ?? 0) > 0.75;
        return {
          id: j.id,
          name: j.name,
          area: j.area,
          code: j.code,
          congestion: status?.congestionLevel ?? 0,
          waitingTime: status?.averageWaitingTime ?? 0,
          isCritical,
        };
      }),
    [filtered, trafficUpdates]
  );

  const handleEmergencyActivation = useCallback(
    async (e) => {
      e.preventDefault();

      if (!emergencyData?.junctionId || !emergencyData?.vehicleType) {
        setEmergencyMessage("Please select a junction and vehicle type");
        return;
      }

      setEmergencyLoading(true);
      try {
        const payload = {
          junctionId: emergencyData.junctionId,
          vehicleType: emergencyData.vehicleType,
          responderName: localStorage.getItem("userName") || "Anonymous",
          destination: emergencyData.destination,
          status: "ACTIVE",
        };
        await apiService.createEmergencyEvent(payload);
        setEmergencyMessage("Emergency corridor activated! Routes clearing...");
        setTimeout(() => {
          setEmergencyData(null);
          setEmergencyMessage("");
          setIsEmergencyModalOpen(false);
        }, 2000);
      } catch (error) {
        setEmergencyMessage(`Error: ${error.message}`);
      } finally {
        setEmergencyLoading(false);
      }
    },
    [emergencyData]
  );

  if (loading) return <LoadingSpinner label="Loading emergency dashboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      {/* Critical Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active Routes" value={summary.activeJunctions} trend="monitored" />
        <StatCard
          label="Critical Areas"
          value={summary.criticalJunctions}
          trend="high congestion"
          className="border-red-500/30"
        />
        <StatCard label="Active Emergencies" value={summary.emergencyCount} trend="incidents" />
      </div>

      {/* Emergency Button - Prominent */}
      <div className="flex gap-4">
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex-1 rounded-xl border-2 border-red-500 bg-red-500/20 px-6 py-4 font-bold text-red-200 hover:bg-red-500/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-lg"
        >
          <span className="text-2xl">🚨</span>
          ACTIVATE EMERGENCY CORRIDOR
        </button>
      </div>

      {/* Map with Legend */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassCard title="Live Traffic Map - Route Planning">
            <CityHeatMap junctions={bootstrap.junctions} trafficUpdates={trafficUpdates} />
          </GlassCard>
        </div>
        <div>
          <HeatMapLegend trafficUpdates={trafficUpdates} junctions={bootstrap.junctions} />
        </div>
      </div>

      {/* Critical Junctions */}
      <GlassCard title="Route Status & Critical Areas">
        <SearchFilterBar query={query} setQuery={setQuery} placeholder="Search routes..." />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-4 py-2 font-semibold text-cyan-200">Route</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Code</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Traffic Level</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Wait Time</th>
                <th className="px-4 py-2 font-semibold text-cyan-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {junctionTableData
                .filter((row) => row.isCritical)
                .concat(junctionTableData.filter((row) => !row.isCritical))
                .map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-white/5 ${
                      row.isCritical ? "bg-red-500/10 hover:bg-red-500/20" : "hover:bg-white/5"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                    <td className="px-4 py-3 text-slate-300">{row.code}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                          row.isCritical
                            ? "bg-red-500/30 text-red-200"
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
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                          row.isCritical
                            ? "bg-red-500/30 text-red-200"
                            : "bg-green-500/30 text-green-200"
                        }`}
                      >
                        {row.isCritical ? "🚨 Critical" : "✓ Normal"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Emergency Modal */}
      <Modal
        isOpen={isEmergencyModalOpen}
        onClose={() => {
          setIsEmergencyModalOpen(false);
          setEmergencyMessage("");
          setEmergencyData(null);
        }}
        title="🚨 Activate Emergency Corridor"
      >
        <form onSubmit={handleEmergencyActivation} className="space-y-4">
          {emergencyMessage && (
            <div
              className={`rounded-lg p-3 text-sm ${
                emergencyMessage.includes("Error")
                  ? "bg-red-500/20 text-red-200"
                  : "bg-green-500/20 text-green-200"
              }`}
            >
              {emergencyMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Vehicle Type</label>
            <select
              value={emergencyData?.vehicleType || ""}
              onChange={(e) => setEmergencyData({ ...emergencyData, vehicleType: e.target.value })}
              disabled={emergencyLoading}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select vehicle type...</option>
              <option value="AMBULANCE">🚑 Ambulance</option>
              <option value="FIRE_TRUCK">🚒 Fire Truck</option>
              <option value="POLICE">🚔 Police Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Starting Junction</label>
            <select
              value={emergencyData?.junctionId || ""}
              onChange={(e) =>
                setEmergencyData({
                  ...emergencyData,
                  junctionId: e.target.value,
                })
              }
              disabled={emergencyLoading}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select starting point...</option>
              {bootstrap.junctions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.name} - {j.area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Destination</label>
            <input
              type="text"
              placeholder="e.g., Central Hospital, Fire Station"
              value={emergencyData?.destination || ""}
              onChange={(e) => setEmergencyData({ ...emergencyData, destination: e.target.value })}
              disabled={emergencyLoading}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsEmergencyModalOpen(false);
                setEmergencyMessage("");
                setEmergencyData(null);
              }}
              disabled={emergencyLoading}
              className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-white hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={emergencyLoading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {emergencyLoading ? "Activating..." : "🚨 ACTIVATE"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
