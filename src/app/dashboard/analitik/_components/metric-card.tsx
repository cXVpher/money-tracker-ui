import type { AnalyticsMetric } from "../_types/analytics";

export function MetricCard({ label, value, tone = "text-success" }: AnalyticsMetric) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
