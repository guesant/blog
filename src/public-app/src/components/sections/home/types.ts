import type { HomePageContent } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';

export type HomeContactSectionProps = {
  page: HomePageContent['page'];
  site: HomePageContent['site'];
  showContact: boolean;
  hasEmail: boolean;
  t: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

export type HomeContactProfileButtonProps = {
  profile: HomePageContent['site']['contact']['profiles'][number];
  tExternalProfiles: ReturnType<typeof useTranslations>;
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
  t: ReturnType<typeof useTranslations>;
};
