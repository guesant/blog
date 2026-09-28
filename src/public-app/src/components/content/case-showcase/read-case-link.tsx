'use client';

import { CaseShowcaseReadAction } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';
import { useTranslations } from '@/i18n/compat';
import { ContentNavigationActionIcon } from '../content-navigation-action-icon';

type ReadCaseLinkProps = { href: string };

export function ReadCaseLink(props: ReadCaseLinkProps) {
  const t = useTranslations('CaseShowcase');

  return (
    <CaseShowcaseReadAction component={LocaleLink} href={props.href}>
      {t('readFullCase')} <ContentNavigationActionIcon direction="external" size={15} />
    </CaseShowcaseReadAction>
  );
}
