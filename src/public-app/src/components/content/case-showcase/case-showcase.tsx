'use client';

import { Box } from '../../ui';
import type { CaseShowcaseProps } from './types';
import { FeaturedCaseCard } from './featured-case-card';
import { SecondaryCaseGrid } from './secondary-case-grid';

export function CaseShowcase(props: CaseShowcaseProps) {
  return (
    <Box>
      <FeaturedCaseCard item={props.cases[0]} />
      <SecondaryCaseGrid items={props.cases.slice(1, 3)} />
    </Box>
  );
}
