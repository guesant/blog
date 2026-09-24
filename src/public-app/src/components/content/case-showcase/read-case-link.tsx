'use client';

import { Icon } from '../../primitives/icon';
import { Link } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';
import { useTranslations } from '@/i18n/compat';

type ReadCaseLinkProps = { href: string };

export function ReadCaseLink(props: ReadCaseLinkProps) {
  const t = useTranslations('CaseShowcase');

  return (
    <Link component={LocaleLink} href={props.href} underline="none" visualVariant="readCaseLink">
      {t('readFullCase')} <Icon name="north-east" size={15} />
    </Link>
  );
}
