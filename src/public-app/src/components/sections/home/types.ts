import type { HomePageContent } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import type { ReactNode } from 'react';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

export type EyebrowProps = {
  children: ReactNode;
};

export type TextLinkProps = { href: string; children: ReactNode };

export type HomeWorkSectionProps = {
  cases: HomePageContent['cases'];
  casesPagination: ContentCollectionMeta;
  page: HomePageContent['page'];
  t: ReturnType<typeof useTranslations>;
};

export type HomeProjectsSectionProps = {
  projects: HomePageContent['projects'];
  projectsPagination: ContentCollectionMeta;
  experimentsCount: HomePageContent['experimentsCount'];
  page: HomePageContent['page'];
  t: ReturnType<typeof useTranslations>;
};

export type HomeExperienceSectionProps = {
  content: HomePageContent;
  page: HomePageContent['page'];
  profile: HomePageContent['profile'];
  t: ReturnType<typeof useTranslations>;
};

export type HomeExperienceItemProps = {
  item: HomePageContent['profile']['trajectory'][number];
  index: number;
};

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
