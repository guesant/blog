import type { CaseStudy, Experiment, Project, TechnologyBadge, Writing } from './content';
import type { WithSeo } from './content';
import type { Profile, ResumeContent } from './resume';
import type { SiteText } from './site';
import type { HomePageCopy, PageIntroduction, ResumePageCopy } from './pages-copy';
import type { ContentCollectionMeta } from '../api/public-site-source-support';

export type HomePageContent = {
  cases: CaseStudy[];
  projects: Project[];
  experiments: Experiment[];
  experimentsCount: number;
  writings: Writing[];
  profile: Profile;
  resume: ResumeContent;
  page: HomePageCopy;
  site: SiteText;
  recurringTechnologies: TechnologyBadge[];
};

export type ResumePageContent = {
  profile: Profile;
  site: SiteText;
  resume: ResumeContent;
  cases: CaseStudy[];
  page: ResumePageCopy;
};

type CreditEntry = {
  url: string;
  category: string;
  name: string;
  description: string;
  packageManager?: string;
};

export type CreditsContent = {
  entries: CreditEntry[];
  meta: ContentCollectionMeta;
};

export type CreditsPageCopy = WithSeo & {
  title: string;
  description: string;
};

export type PackageCredit = {
  name: string;
  version?: string;
  description?: string;
  license?: string;
  author?: string;
  repositoryUrl?: string;
};

export type CreditsPageContent = {
  page: CreditsPageCopy;
  credits: CreditsContent;
  libraries: PackageCredit[];
  tools: PackageCredit[];
};

export type PortfolioPageCopy = WithSeo & {
  heroIdentity: string;
  heroExperience: string;
  heroCurrentFocus: string;
  availableLabel: string;
  workEyebrow: string;
  workTitle: string;
  workDescription: string;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsDescription: string;
  experimentsSummary: string;
};

export type NowPageCopy = PageIntroduction & { entries: NowPageEntry[] };

export type NowPageEntry = { key: string; label: string; value: string };

export type FollowPageEntry = {
  key: string;
  url?: string;
  title: string;
  description?: string;
};

export type FollowPageCopy = PageIntroduction & {
  intro: string;
  sectionLabel: string;
  sectionTitle: string;
  futureLabel: string;
  futureTitle: string;
  plannedLabel: string;
  entries: FollowPageEntry[];
  futureEntries: FollowPageEntry[];
  [key: string]: string | FollowPageEntry[] | undefined;
};

export type LicensePageCopy = PageIntroduction & {
  sectionLabel: string;
  sectionTitle: string;
  codeHeading: string;
  codeBody: string;
  contentHeading: string;
  contentBody: string;
  aiHeading: string;
  aiBody: string;
  contact: string;
};

export type NavigationAvailability = {
  cases: boolean;
  projects: boolean;
  writing: boolean;
  achados: boolean;
  contact: boolean;
};
