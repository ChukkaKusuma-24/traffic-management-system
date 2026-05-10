import { DataTable } from "../components/common/DataTable";
import { ErrorState } from "../components/common/ErrorState";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { SearchFilterBar } from "../components/common/SearchFilterBar";
import { useRealtimeContext } from "../context/useRealtimeContext";
import { useSearchFilter } from "../hooks/useSearchFilter";

export function AIRouteExplainerPage() {
  const { loading, error, bootstrap } = useRealtimeContext();
  const predictionRows = bootstrap.predictions.map((prediction) => ({
    id: prediction.id,
    junction: prediction.junction?.name ?? "Unknown",
    congestion: prediction.predictedCongestion,
    confidence: prediction.confidenceScore,
    vehicles: prediction.predictedVehicleCount,
  }));

  const { query, setQuery, filtered } = useSearchFilter(
    predictionRows,
    (row) => `${row.junction} ${row.vehicles}`
  );

  if (loading) return <LoadingSpinner label="Building AI route reasoning..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-5">
      <GlassCard title="AI Route Explainability Engine" subtitle="Transparent route scoring and decision logic">
        <p className="text-sm text-slate-200">
          The route engine scores every corridor using predicted congestion, emergency priority, and
          dynamic signal adaptation. Explanations are generated to keep operator decisions auditable.
        </p>
      </GlassCard>

      <GlassCard title="Search Predictions">
        <SearchFilterBar query={query} onQueryChange={setQuery} placeholder="Filter route insights..." />
      </GlassCard>

      <GlassCard title="Reasoned Route Suggestions">
        <DataTable
          columns={[
            { key: "junction", label: "Junction" },
            { key: "vehicles", label: "Predicted Vehicles" },
            { key: "congestion", label: "Predicted Congestion" },
            { key: "confidence", label: "Confidence Score" },
          ]}
          rows={filtered}
        />
      </GlassCard>
    </div>
  );
}
