'use client';

import { Box } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { CaseLink } from './case-link';

type SecondaryCaseGridProps = { items: CaseStudy[] };

export function SecondaryCaseGrid(props: SecondaryCaseGridProps) {
  if (props.items.length === 0) {
    return null;
  }
  return (
    <Box visualVariant="secondaryCaseGrid">
      {props.items.map((item) => (
        <CaseLink key={item.slug} item={item} compact />
      ))}
    </Box>
  );
}
