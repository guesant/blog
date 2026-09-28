'use client';

import { CaseFeaturedVisualFrame } from '../../ui';
import { CaseIllustration } from '../case-illustration';
import type { CaseStudy } from '@portfolio/data/domain/types';

type FeaturedCaseVisualProps = { visual: CaseStudy['visual'] };

export function FeaturedCaseVisual(props: FeaturedCaseVisualProps) {
  return (
    <CaseFeaturedVisualFrame>
      <CaseIllustration visual={props.visual} compact />
    </CaseFeaturedVisualFrame>
  );
}
