'use client';

import { CaseFeaturedFooterFrame, CaseFeaturedTechnologies } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { ReadCaseLink } from './read-case-link';

type FeaturedCaseFooterProps = { item: CaseStudy };

export function FeaturedCaseFooter(props: FeaturedCaseFooterProps) {
  return (
    <CaseFeaturedFooterFrame>
      <CaseFeaturedTechnologies>{props.item.technologies.join(' · ')}</CaseFeaturedTechnologies>
      <ReadCaseLink href={props.item.url ?? `/cases/${props.item.slug}`} />
    </CaseFeaturedFooterFrame>
  );
}
