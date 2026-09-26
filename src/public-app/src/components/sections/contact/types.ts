import type { PageIntroduction, SiteText } from '@portfolio/data/domain/types';
import type { ContactTranslator, ExternalProfilesTranslator } from '@/i18n/compat-support';

export type ContactDetailsProps = {
  site: SiteText;
  hasEmail: boolean;
  t: ContactTranslator;
  tExternalProfiles: ExternalProfilesTranslator;
};

export type ContactPageContentProps = { page: PageIntroduction; site: SiteText };
