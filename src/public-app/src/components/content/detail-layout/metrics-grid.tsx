import type { MetricsGridProps } from './types';
import { MetricsGridFrame } from '../../ui/semantic/MetricsGridFrame';
import { MetricItem } from './metric-item';

export function MetricsGrid(props: MetricsGridProps) {
  if (props.metrics.length === 0) return null;

  return (
    <MetricsGridFrame>
      {props.metrics.map((metric) => (
        <MetricItem
          key={`${metric.label}-${metric.value}`}
          label={metric.label}
          value={metric.value}
        />
      ))}
    </MetricsGridFrame>
  );
}
