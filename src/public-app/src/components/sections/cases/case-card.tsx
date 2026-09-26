'use client';

import { Card } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { NavLink } from '../../primitives/nav-link';
import type { CaseCardProps } from './types';
import { CaseReadAction } from '../../content/case-read-action';
import { CaseSummary } from '../../content/case-summary';
import { CaseTechnologies } from '../../content/case-technologies';

export function CaseCard(props: CaseCardProps) {
  const t = useTranslations('Pages.cases');

  return (
    <Card
      component={NavLink}
      href={props.item.url ?? `/cases/${props.item.slug}`}
      underline="none"
      color="inherit"
      visualVariant="caseCard"
    >
      <CaseSummary
        item={props.item}
        meta={`${props.item.number} · ${props.item.meta}`}
        headingLevel="h2"
        titleClassName="case-title"
        titleVisualVariant="caseCard"
        summaryVisualVariant="caseCard2"
      />
      <CaseTechnologies item={props.item} visualVariant="caseCard3" />
      <CaseReadAction label={t('viewCase')} visualVariant="caseCard4" />
    </Card>
  );
}
