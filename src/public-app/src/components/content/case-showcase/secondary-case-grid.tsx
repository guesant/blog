'use client';

import { CaseShowcaseGridFrame } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { CaseLink } from './case-link';

type SecondaryCaseGridProps = { items: CaseStudy[] };

export function SecondaryCaseGrid(props: SecondaryCaseGridProps) {
  if (props.items.length === 0) {
    return null;
  }
  return (
    <CaseShowcaseGridFrame>
      {props.items.map((item) => (
        <CaseLink key={item.slug} item={item} compact />
      ))}
    </CaseShowcaseGridFrame>
  );
}
