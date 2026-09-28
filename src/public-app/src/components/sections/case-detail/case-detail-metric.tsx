'use client';

import { Box, Typography } from '../../ui';
import { Icon } from '../../primitives/icon';
import { CaseDetailMetricText } from '../../ui/semantic/CaseDetailMetricText';

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
      <CaseDetailMetricText variant="overline" color="text.secondary">
        <Icon name={icon} size={15} />
        {label}
      </CaseDetailMetricText>
      <Typography color="text.secondary">{value}</Typography>
    </Box>
  );
}
