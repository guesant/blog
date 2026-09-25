import type { CaseStudy, TechnologyBadge } from './content';
import type { WithSeo } from './content';
import type { Profile, ResumeContent } from './resume';
import type { SiteText } from './site';
import type { HomePageCopy, PageIntroduction, ResumePageCopy } from './pages-copy';
import type { HomeGallery } from './pages-gallery';
import type { ContentCollectionMeta } from '../api/public-site-source-support';

export type {
  HomeCollectionShowcase,
  HomeGallery,
  HomeGalleryEntry,
  HomeGalleryEntryKind,
  HomeGalleryFeedCategories,
  HomeGalleryPortfolio,
  HomeGalleryPortfolioTotals,
  HomeGallerySectionTotals,
  HomeGalleryTotals,
} from './pages-gallery';

export type HomePageContent = {
  profile: Profile;
  page: HomePageCopy;
  site: SiteText;
  recurringTechnologies: TechnologyBadge[];
  gallery: HomeGallery;
};

export type ResumePageContent = {
  profile: Profile;
  site: SiteText;
  resume: ResumeContent;
  cases: CaseStudy[];
  page: ResumePageCopy;
};

export type CreditEntry = {
  url: string;
  category: string;
  name: string;
  description: string;
  packageManager?: string;
};

type CreditsGroups = {
  acknowledgements: CreditEntry[];
  references: CreditEntry[];
  infrastructure: CreditEntry[];
  libraries: CreditEntry[];
  tools: CreditEntry[];
};

export type CreditsContent = {
  entries: CreditEntry[];
  meta: ContentCollectionMeta;
  groups: CreditsGroups;
};

export type CreditsPageCopy = WithSeo & {
  title: string;
  description: string;
};

export type CreditsPageContent = {
  page: CreditsPageCopy;
  credits: CreditsContent;
};

export type PortfolioPageCopy = WithSeo & {
  title: string;
  description: string;
  heroExperience: string;
  heroCurrentFocus: string;
  availableLabel: string;
  workTitle: string;
  workDescription: string;
  projectsTitle: string;
  projectsDescription: string;
  experimentsSummary: string;
};

export type NowPageCopy = PageIntroduction & {
  entries: Array<{ key: string; label: string; value: string }>;
};

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
