'use client';

import { Box, Typography } from '../../ui';
import type { TechnologyMarqueeProps } from './types';
import { TechnologyMarqueeRow } from './technology-marquee-row';

export function TechnologyMarquee(props: TechnologyMarqueeProps) {
  const { technologies, label } = props;

  if (technologies.length === 0) {
    return null;
  }

  const leadingRow = technologies.filter((_, index) => index % 2 === 0);

  const trailingRow = technologies.filter((_, index) => index % 2 === 1);

  return (
    <Box visualVariant="technologyMarquee">
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <Box visualVariant="technologyMarquee2">
        <TechnologyMarqueeRow technologies={leadingRow} />
        <TechnologyMarqueeRow technologies={trailingRow} reverse />
      </Box>
    </Box>
  );
}
