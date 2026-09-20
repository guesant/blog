'use client';

import { Box, Typography } from '../../ui';
import { Icon } from '../../primitives/icon';

type CaseDetailMetricProps = {
  label: string;
  field: string;
  value: string;
  icon: 'problem' | 'solution' | 'evolution';
};

export function CaseDetailMetric(props: CaseDetailMetricProps) {
  const { label, icon, value } = props;

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" visualVariant="caseDetailMetric">
        <Icon name={icon} size={15} />
        {label}
      </Typography>
      <Typography color="text.secondary">{value}</Typography>
    </Box>
  );
}
