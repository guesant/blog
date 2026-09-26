'use client';

import { Box } from '../../ui';
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
    <Box visualVariant="featuredCaseDetails">
      <CaseSummary
        item={props.item}
        meta={`${t('selectedCase')} ${props.item.number} · ${props.item.meta}`}
        headingLevel="h3"
        titleVisualVariant="featuredCaseDetails"
        summaryVisualVariant="featuredCaseDetails2"
      />
      <FeaturedCaseFacts item={props.item} />
      <FeaturedCaseFooter item={props.item} />
    </Box>
  );
}
