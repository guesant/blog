'use client';

import { Card, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import { Icon } from '../../primitives/icon';
import type { CaseLinkProps } from './types';
import { caseLinkVisuals } from './case-link-visuals';

export function CaseLink(props: CaseLinkProps) {
  const { item } = props;

  const t = useTranslations('CaseShowcase');

  const visuals = caseLinkVisuals(props);

  return (
    <Card component={LocaleLink} href={visuals.href} visualVariant={visuals.cardVariant}>
      <Typography variant="overline" color="text.secondary">
        {t('selectedCase')} {item.number} · {visuals.status}
      </Typography>
      <Typography className="case-link-title" variant="h3" visualVariant={visuals.titleVariant}>
        {item.title}
      </Typography>
      <Typography color="text.secondary" visualVariant="caseLinkSummary">
        {item.summary}
      </Typography>
      <Typography visualVariant="caseLinkTechnologies">{item.technologies.join(' · ')}</Typography>
      <Typography color="secondary" visualVariant="caseLinkReadMore">
        {t('readFullCase')} <Icon name="north-east" size={15} />
      </Typography>
    </Card>
  );
}
