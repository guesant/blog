import type { HomePageContent } from '@portfolio/data/domain/types';
import type { ExternalProfilesTranslator, HomeTranslator } from '@/i18n/compat-support';

export type HomeContactSectionProps = {
  page: HomePageContent['page'];
  site: HomePageContent['site'];
  showContact: boolean;
  hasEmail: boolean;
  t: HomeTranslator;
  tExternalProfiles: ExternalProfilesTranslator;
};

export type HomeAvailabilityProps = {
  page: HomePageContent['page'];
  showContact: boolean;
};

export type HomeHeroProps = {
  page: HomePageContent['page'];
  profile: HomePageContent['profile'];
  showContact: boolean;
  site: HomePageContent['site'];
  workTarget: string | null;
  t: HomeTranslator;
};
