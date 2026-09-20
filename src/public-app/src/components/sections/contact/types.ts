import type { PageIntroduction, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';

export type ContactDetailsProps = {
  page: PageIntroduction;
  site: SiteText;
  hasEmail: boolean;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

export type ContactLabelProps = Pick<ContactDetailsProps, 'page' | 'site' | 'hasEmail' | 'tCommon'>;

export function contactLabel(props: ContactLabelProps) {
  const { page, site, tCommon } = props;

  if (!site.contact.available) {
    return tCommon('unavailable');
  }
  return page.eyebrow;
}

export type ContactPageContentProps = { page: PageIntroduction; site: SiteText };
