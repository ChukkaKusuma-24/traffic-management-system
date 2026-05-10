import { CongestionAreaChart } from "../components/charts/CongestionAreaChart";
import { PredictionBarChart } from "../components/charts/PredictionBarChart";
import { ErrorState } from "../components/common/ErrorState";
import { GlassCard } from "../components/common/GlassCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { StatCard } from "../components/common/StatCard";
import { useRealtimeContext } from "../context/useRealtimeContext";

export function AnalyticsPredictionPage() {
  const { loading, error, bootstrap, trafficUpdates } = useRealtimeContext();

  if (loading) return <LoadingSpinner label="Preparing analytics..." />;
  if (error) return <ErrorState message={error} />;

  const chartData = trafficUpdates.slice(0, 12).reverse().map((item, index) => ({
    time: `T-${12 - index}`,
    congestion: Number((item.congestionLevel * 100).toFixed(2)),
  }));

  const predictionData = bootstrap.predictions.map((item) => ({
    name: item.junction?.name ?? "Junction",
    predictedVehicleCount: item.predictedVehicleCount,
  }));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sample Size" value={bootstrap.analytics?.sampleSize ?? 0} />
        <StatCard label="Vehicles Observed" value={bootstrap.analytics?.vehiclesObserved ?? 0} />
        <StatCard
          label="Avg Speed"
          value={`${bootstrap.analytics?.averageSpeedKmph ?? 0} km/h`}
          trend="rolling estimate"
        />
      </div>

      <GlassCard title="Congestion Trend (Realtime)">
        <CongestionAreaChart data={chartData} />
      </GlassCard>

      <GlassCard title="AI Predicted Vehicle Load">
        <PredictionBarChart data={predictionData} />
      </GlassCard>

      <GlassCard title="AI Reasoning Panel" subtitle="Model rationale with explainable factors">
        <ul className="space-y-2 text-sm text-slate-200">
          <li>- Predicted peaks are driven by historical weekday traffic profiles.</li>
          <li>- Sudden incident spikes increase confidence penalty and widen uncertainty bands.</li>
          <li>- Green-wave corridors are prioritized where average speed drops under threshold.</li>
        </ul>
      </GlassCard>
    </div>
  );
}
