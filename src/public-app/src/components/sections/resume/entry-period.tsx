'use client';

import { Typography } from '../../ui';
import type { EntryPeriodProps } from './types';

export function EntryPeriod(props: EntryPeriodProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      {props.period}
    </Typography>
  );
}
