import type { PageIntroduction, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';

export type ContactDetailsProps = {
  site: SiteText;
  hasEmail: boolean;
  t: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

export type ContactPageContentProps = { page: PageIntroduction; site: SiteText };
