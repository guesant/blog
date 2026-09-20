import { Box } from '../../ui';
import type { MetricsGridProps } from './types';
import { MetricItem } from './metric-item';

export function MetricsGrid(props: MetricsGridProps) {
  const { metrics, marginTop } = props;

  if (metrics.length === 0) {
    return null;
  }

  return (
    <Box visualVariant={marginTop === 6 ? 'metricsGridMargin6' : 'metricsGridMargin4'}>
      {metrics.map((metric) => (
        <MetricItem
          key={`${metric.label}-${metric.value}`}
          label={metric.label}
          value={metric.value}
        />
      ))}
    </Box>
  );
}
