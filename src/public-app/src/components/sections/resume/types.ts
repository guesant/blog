import type { CaseStudy, ResumePageContent as ResumeContent } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import type { ReactNode } from 'react';

export const pdfLocaleLabels: Record<string, string> = { en: 'English', 'pt-BR': 'Português' };

export type TrajectoryItem = ResumeContent['profile']['trajectory'][number];

export type EducationItem = ResumeContent['resume']['education'][number];

export type RecommendationItem = ResumeContent['resume']['recommendations'][number];

export type CredentialSection = {
  key: string;
  title: string;
  items: ResumeContent['resume']['certificates'];
};

export type ResumeProfile = ResumeContent['site']['contact']['profiles'][number];

export type ResumeSkillGroup = ResumeContent['resume']['skills'][number];

export type ResumePdfActionsProps = {
  locale: string;
  pdfUrls: Record<string, string>;
  t: (key: string) => string;
};

export type ResumeSectionProps = { title: string; children: ReactNode };

type EditableNamedItem = { name: string; url?: string };

export type EditableItemNameProps = {
  item: EditableNamedItem;
};

export type ResumeEntryGridProps = { children: ReactNode };

export type EntryPeriodProps = { period: string };

export type ResumeEntryHeadingProps = {
  item: EditableNamedItem & { period: string };
  children: ReactNode;
};

export type EntryDescriptionProps = { description?: string };

export type ResumeEntriesProps<Item extends { name: string; period: string }> = {
  items: Item[];
  children: (item: Item, index: number) => ReactNode;
};

export type TrajectoryEntriesProps = {
  items: TrajectoryItem[];
};

export type EducationEntriesProps = {
  items: { institution: string; location: string; degree: string; period: string }[];
};

export type CredentialEntriesProps = {
  items: { name: string; issuer: string; url?: string; period: string; credentialId?: string }[];
};

export type RecommendationEntriesProps = {
  items: { author: string; role: string; quote: string; url?: string; period?: string }[];
};

export type TechnicalProductionItem = {
  name: string;
  kind?: string;
  description?: string;
  url?: string;
  period: string;
  projectHref?: string;
};

export type TechnicalProductionEntriesProps = {
  items: TechnicalProductionItem[];
};

export type EventEntriesProps = {
  items: {
    name: string;
    role?: string;
    talkTitle?: string;
    location?: string;
    period: string;
    url?: string;
  }[];
};

export type AwardEntriesProps = {
  items: { name: string; issuer: string; description?: string; period: string; url?: string }[];
};

export type ResumeCaseProps = { staticItem: CaseStudy };

export type ResumeCredentialsProps = {
  resume: ResumeContent['resume'];
  t: ReturnType<typeof useTranslations>;
};

export type ResumeHeaderProps = {
  page: ResumeContent['page'];
  profile: ResumeContent['profile'];
  site: ResumeContent['site'];
  hasEmail: boolean;
  hasProfiles: boolean;
  locale: string;
  pdfUrls: Record<string, string>;
  t: ReturnType<typeof useTranslations>;
  tExternalProfiles: ReturnType<typeof useTranslations>;
};

export type ResumeOverviewSectionsProps = {
  resume: ResumeContent['resume'];
  t: ReturnType<typeof useTranslations>;
};

type ResumeExperienceItem = {
  item: ResumeContent['profile']['trajectory'][number];
};

export type ResumeWorkSectionsProps = {
  cases: CaseStudy[];
  experience: ResumeExperienceItem[];
  t: ReturnType<typeof useTranslations>;
};

export type ResumeQualificationSectionsProps = {
  resume: ResumeContent['resume'];
  t: ReturnType<typeof useTranslations>;
};

export type ResumePageContentProps = {
  content: ResumeContent;
  pdfUrls: Record<string, string>;
};
