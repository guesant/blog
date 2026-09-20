'use client';

import { Box, Typography } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { FeaturedCaseFacts } from './featured-case-facts';
import { FeaturedCaseFooter } from './featured-case-footer';

type FeaturedCaseDetailsProps = {
  item: CaseStudy;
};

export function FeaturedCaseDetails(props: FeaturedCaseDetailsProps) {
  const t = useTranslations('CaseShowcase');

  return (
    <Box visualVariant="featuredCaseDetails">
      <Typography variant="overline" color="text.secondary">
        {t('selectedCase')} {props.item.number} · {props.item.meta}
      </Typography>
      <Typography variant="h3" visualVariant="featuredCaseDetails">
        {props.item.title}
      </Typography>
      <Typography color="text.secondary" visualVariant="featuredCaseDetails2">
        {props.item.summary}
      </Typography>
      <FeaturedCaseFacts item={props.item} />
      <FeaturedCaseFooter item={props.item} />
    </Box>
  );
}
