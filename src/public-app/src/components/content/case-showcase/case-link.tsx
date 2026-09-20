'use client';

import { Card, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import { Icon } from '../../primitives/icon';
import type { CaseLinkProps } from './types';

export function CaseLink(props: CaseLinkProps) {
  const { item, compact = false } = props;

  const t = useTranslations('CaseShowcase');

  const content = item;

  return (
    <Card
      component={LocaleLink}
      href={`/cases/${content.slug}`}
      visualVariant={compact ? 'caseLinkCardCompact' : 'caseLinkCardFull'}
    >
      <Typography variant="overline" color="text.secondary">
        {t('selectedCase')} {item.number} · {content.status ?? content.meta}
      </Typography>
      <Typography
        className="case-link-title"
        variant="h3"
        visualVariant={compact ? 'caseLinkTitleCompact' : 'caseLinkTitleFull'}
      >
        {content.title}
      </Typography>
      <Typography color="text.secondary" visualVariant="caseLinkSummary">
        {content.summary}
      </Typography>
      <Typography visualVariant="caseLinkTechnologies">
        {content.technologies.join(' · ')}
      </Typography>
      <Typography color="secondary" visualVariant="caseLinkReadMore">
        {t('readFullCase')} <Icon name="north-east" size={15} />
      </Typography>
    </Card>
  );
}
