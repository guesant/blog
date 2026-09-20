'use client';

import { Box } from '../../ui';
import type { CaseStudy } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { CaseFact } from './case-fact';

type FeaturedCaseFactsProps = { item: CaseStudy };

export function FeaturedCaseFacts(props: FeaturedCaseFactsProps) {
  const t = useTranslations('CaseShowcase');

  const facts = [
    { label: t('context'), value: props.item.context, field: 'context' },
    { label: t('role'), value: props.item.role, field: 'role' },
    { label: t('outcome'), value: props.item.result, field: 'result' },
  ];

  return (
    <Box visualVariant="featuredCaseFacts">
      {facts.map((fact) => (
        <CaseFact key={fact.field} {...fact} />
      ))}
    </Box>
  );
}
