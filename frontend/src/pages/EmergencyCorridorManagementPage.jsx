import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { EmergencyRouteMap } from "../components/maps/EmergencyRouteMap";
import { useRealtimeContext } from "../context/useRealtimeContext";
import { formatDateTime } from "../utils/formatters";

export function EmergencyCorridorManagementPage() {
  const { loading, error, bootstrap, emergencyAlerts, incidentReports } = useRealtimeContext();
  if (loading) return <LoadingSpinner label="Preparing emergency corridor controls..." />;
  if (error) return <ErrorState message={error} />;

  const events = emergencyAlerts.length > 0 ? emergencyAlerts : bootstrap.emergencies;
  const incidents = incidentReports.length > 0 ? incidentReports : bootstrap.incidents;

  return (
    <div className="space-y-5">
      <GlassCard title="Emergency Route Overlays" subtitle="Priority lane and corridor visualization">
        <EmergencyRouteMap junctions={bootstrap.junctions} events={events} />
      </GlassCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassCard title="Emergency Events">
          <DataTable
            columns={[
              { key: "type", label: "Type" },
              { key: "description", label: "Description" },
              { key: "priority", label: "Priority" },
              { key: "startedAt", label: "Started", render: (row) => formatDateTime(row.startedAt) },
            ]}
            rows={events.slice(0, 20)}
          />
        </GlassCard>

        <GlassCard title="Live Incident Feed">
          <DataTable
            columns={[
              { key: "title", label: "Title" },
              { key: "severity", label: "Severity" },
              { key: "status", label: "Status" },
              { key: "occurredAt", label: "Occurred", render: (row) => formatDateTime(row.occurredAt) },
            ]}
            rows={incidents.slice(0, 20)}
          />
        </GlassCard>
      </div>
    </div>
  );
}
