import { MetricsGridMargin4Frame } from '../../ui/semantic/MetricsGridMargin4Frame';
import { MetricsGridMargin6Frame } from '../../ui/semantic/MetricsGridMargin6Frame';
import type { MetricsGridProps } from './types';
import { MetricItem } from './metric-item';

export function MetricsGrid(props: MetricsGridProps) {
  const { metrics, marginTop } = props;

  if (metrics.length === 0) {
    return null;
  }

  const Frame = marginTop === 6 ? MetricsGridMargin6Frame : MetricsGridMargin4Frame;

  return (
    <Frame>
      {metrics.map((metric) => (
        <MetricItem
          key={`${metric.label}-${metric.value}`}
          label={metric.label}
          value={metric.value}
        />
      ))}
    </Frame>
  );
}
