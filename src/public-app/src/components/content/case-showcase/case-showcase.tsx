'use client';

import type { CaseShowcaseProps } from './types';
import { FeaturedCaseCard } from './featured-case-card';
import { SecondaryCaseGrid } from './secondary-case-grid';
import { CaseShowcaseFrame } from '../../ui/semantic/CaseShowcaseFrame';

export function CaseShowcase(props: CaseShowcaseProps) {
  return (
    <CaseShowcaseFrame>
      <FeaturedCaseCard item={props.cases[0]} />
      <SecondaryCaseGrid items={props.cases.slice(1)} />
    </CaseShowcaseFrame>
  );
}
