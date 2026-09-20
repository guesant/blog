'use client';

import { Typography } from '../../../ui';
import type { EyebrowProps } from '../types';

export function Eyebrow(props: EyebrowProps) {
  const { children } = props;

  return (
    <Typography variant="overline" color="text.secondary">
      {children}
    </Typography>
  );
}
