import { Box, Typography } from '../../ui';
import { MetricItemText } from '../../ui/semantic/MetricItemText';

type MetricItemProps = { label: string; value: string };

export function MetricItem(props: MetricItemProps) {
  const { label, value } = props;

  return (
    <Box>
      <MetricItemText variant="h5">{value}</MetricItemText>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
