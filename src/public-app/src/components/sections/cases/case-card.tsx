'use client';

import { Card } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { NavLink } from '../../primitives/nav-link';
import type { CaseCardProps } from './types';
import { CasePresentation } from '../../content/case-presentation';
import { CaseReadAction } from '../../content/case-read-action';

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
      <CasePresentation
        item={props.item}
        meta={`${props.item.number} · ${props.item.meta}`}
        headingLevel="h2"
        titleClassName="case-title"
        titleVisualVariant="caseCard"
        summaryVisualVariant="caseCard2"
        technologiesVisualVariant="caseCard3"
        action={<CaseReadAction label={t('viewCase')} visualVariant="caseCard4" />}
      />
    </Card>
  );
}
