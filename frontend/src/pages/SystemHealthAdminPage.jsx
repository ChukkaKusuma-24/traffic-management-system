import { HealthLineChart } from "../components/charts/HealthLineChart";
import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { StatCard } from "../components/common/StatCard";
import { useRealtimeContext } from "../context/useRealtimeContext";
import { formatDateTime } from "../utils/formatters";

export function SystemHealthAdminPage() {
  const { loading, error, bootstrap, healthUpdates, connected } = useRealtimeContext();

  if (loading) return <LoadingSpinner label="Collecting health metrics..." />;
  if (error) return <ErrorState message={error} />;

  const latest = healthUpdates[0] ?? bootstrap.systemHealth[0];
  const chartData = (healthUpdates.length > 0 ? healthUpdates : bootstrap.systemHealth)
    .slice(0, 12)
    .reverse()
    .map((item, idx) => ({
      time: `M${idx + 1}`,
      cpu: item.cpuUsagePercent,
      memory: item.memoryUsagePercent,
    }));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Service Status" value={latest?.status ?? "N/A"} />
        <StatCard label="CPU Usage" value={`${latest?.cpuUsagePercent ?? 0}%`} />
        <StatCard label="Memory Usage" value={`${latest?.memoryUsagePercent ?? 0}%`} />
        <StatCard label="Socket Clients" value={latest?.activeSocketClients ?? 0} trend={connected ? "live" : "offline"} />
      </div>

      <GlassCard title="System Monitoring Widgets">
        <HealthLineChart data={chartData} />
      </GlassCard>

      <GlassCard title="System Health Logs">
        <DataTable
          columns={[
            { key: "serviceName", label: "Service" },
            { key: "status", label: "Status" },
            { key: "responseTimeMs", label: "Response (ms)" },
            { key: "recordedAt", label: "Timestamp", render: (row) => formatDateTime(row.recordedAt) },
          ]}
          rows={(healthUpdates.length > 0 ? healthUpdates : bootstrap.systemHealth).slice(0, 20)}
        />
      </GlassCard>
    </div>
  );
}
