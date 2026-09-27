'use client';

import { Card } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import type { CaseLinkProps } from './types';
import { caseLinkVisuals } from './case-link-visuals';
import { CasePresentation } from '../case-presentation';
import { CaseReadAction } from '../case-read-action';

export function CaseLink(props: CaseLinkProps) {
  const t = useTranslations('CaseShowcase');

  const visuals = caseLinkVisuals(props);

  return (
    <Card component={LocaleLink} href={visuals.href} visualVariant={visuals.cardVariant}>
      <CasePresentation
        item={props.item}
        meta={`${t('selectedCase')} ${props.item.number} · ${visuals.status}`}
        headingLevel="h3"
        titleClassName="case-link-title"
        titleVisualVariant={visuals.titleVariant}
        summaryVisualVariant="caseLinkSummary"
        technologiesVisualVariant="caseLinkTechnologies"
        action={<CaseReadAction label={t('readFullCase')} visualVariant="caseLinkReadMore" />}
      />
    </Card>
  );
}
