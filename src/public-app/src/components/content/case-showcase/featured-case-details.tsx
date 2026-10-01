'use client';

import { CaseCardSummary, CaseCardTitle, CaseFeaturedDetailsFrame } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { FeaturedCaseFacts } from './featured-case-facts';
import { FeaturedCaseFooter } from './featured-case-footer';
import { CaseSummary } from '../case-summary';

type FeaturedCaseDetailsProps = {
  item: CaseStudy;
};

export function FeaturedCaseDetails(props: FeaturedCaseDetailsProps) {
  const t = useTranslations('CaseShowcase');

  return (
    <CaseFeaturedDetailsFrame>
      <CaseSummary
        item={props.item}
        meta={`${t('selectedCase')} ${props.item.number} · ${props.item.meta}`}
      />
      <CaseCardTitle component="h3">{props.item.title}</CaseCardTitle>
      <CaseCardSummary>{props.item.summary}</CaseCardSummary>
      <FeaturedCaseFacts item={props.item} />
      <FeaturedCaseFooter item={props.item} />
    </CaseFeaturedDetailsFrame>
  );
}
