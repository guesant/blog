import { Box, Typography } from '../../ui';

type MetricItemProps = { label: string; value: string };

export function MetricItem(props: MetricItemProps) {
  const { label, value } = props;

  return (
    <Box>
      <Typography variant="h5" visualVariant="metricItem">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
