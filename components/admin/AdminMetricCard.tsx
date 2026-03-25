export type MetricCardData = {
  label: string;
  value: string;
  support: string;
};

export function AdminMetricCard({ metric }: { metric: MetricCardData }) {
  return (
    <article className="admin-metric-card">
      <span>{metric.label}</span>
      <strong>{metric.value}</strong>
      <small>{metric.support}</small>
    </article>
  );
}
