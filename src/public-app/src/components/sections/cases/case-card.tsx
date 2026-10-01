'use client';

import { CaseListingCardFrame } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { NavLink } from '../../primitives/nav-link';
import type { CaseCardProps } from './types';
import { CasePresentation } from '../../content/case-presentation';

export function CaseCard(props: CaseCardProps) {
  const t = useTranslations('Pages.cases');

  return (
    <CaseListingCardFrame
      component={NavLink}
      href={props.item.url ?? `/cases/${props.item.slug}`}
      underline="none"
      color="inherit"
    >
      <CasePresentation
        item={props.item}
        meta={`${props.item.number} · ${props.item.meta}`}
        headingLevel="h2"
        actionLabel={t('viewCase')}
      />
    </CaseListingCardFrame>
  );
}
