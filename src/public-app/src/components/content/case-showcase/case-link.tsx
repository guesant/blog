'use client';

import { CaseShowcaseCardFrame } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../../i18n/navigation';
import type { CaseLinkProps } from './types';
import { caseLinkVisuals } from './case-link-visuals';
import { CasePresentation } from '../case-presentation';

export function CaseLink(props: CaseLinkProps) {
  const t = useTranslations('CaseShowcase');

  const visuals = caseLinkVisuals(props);

  return (
    <CaseShowcaseCardFrame component={LocaleLink} href={visuals.href} compact={props.compact}>
      <CasePresentation
        item={props.item}
        meta={`${t('selectedCase')} ${props.item.number} · ${visuals.status}`}
        headingLevel="h3"
        presentation="showcase"
        compact={props.compact}
        actionLabel={t('readFullCase')}
      />
    </CaseShowcaseCardFrame>
  );
}
