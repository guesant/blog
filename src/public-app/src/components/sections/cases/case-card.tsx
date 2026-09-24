'use client';

import { Card, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Icon } from '../../primitives/icon';
import { NavLink } from '../../primitives/nav-link';
import type { CaseCardProps } from './types';

export function CaseCard(props: CaseCardProps) {
  const { item: staticItem } = props;

  const t = useTranslations('Pages.cases');

  const item = staticItem;

  return (
    <Card
      component={NavLink}
      href={item.url ?? `/cases/${item.slug}`}
      underline="none"
      color="inherit"
      visualVariant="caseCard"
    >
      <Typography variant="overline" color="text.secondary">
        {staticItem.number} · {item.meta}
      </Typography>
      <Typography className="case-title" component="h2" variant="h3" visualVariant="caseCard">
        {item.title}
      </Typography>
      <Typography color="text.secondary" visualVariant="caseCard2">
        {item.summary}
      </Typography>
      <Typography visualVariant="caseCard3">{item.technologies.join(' · ')}</Typography>
      <Typography color="secondary" visualVariant="caseCard4">
        {t('viewCase')} <Icon name="north-east" size={15} />
      </Typography>
    </Card>
  );
}
