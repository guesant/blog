'use client';

import { CaseFeaturedCardFrame } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { FeaturedCaseDetails } from './featured-case-details';
import { FeaturedCaseVisual } from './featured-case-visual';

type FeaturedCaseCardProps = { item: CaseStudy };

export function FeaturedCaseCard(props: FeaturedCaseCardProps) {
  const content = props.item;

  return (
    <CaseFeaturedCardFrame>
      <FeaturedCaseVisual visual={content.visual} />
      <FeaturedCaseDetails item={content} />
    </CaseFeaturedCardFrame>
  );
}
