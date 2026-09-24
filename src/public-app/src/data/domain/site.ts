import type { ProtectedEmailChallenge } from './protected-email/types.ts';
import type { WithSeo } from './content';

type ExternalProfilePlatform =
  | 'linkedin'
  | 'github'
  | 'lattes'
  | 'orcid'
  | 'instagram'
  | 'gitlab'
  | 'scholar'
  | 'researchgate'
  | 'mastodon'
  | 'bluesky'
  | 'other';

export type ExternalProfile = {
  platform: ExternalProfilePlatform;
  label?: string;
  url: string;
};

type ContactInformation = {
  hasEmail: boolean;
  emailChallenge?: ProtectedEmailChallenge;
  profiles: ExternalProfile[];
  available: boolean;
};

type MaintenanceContent = {
  title: string;
  description: string;
};

export type NavigationItem = {
  route: string;
  label: string;
  children: NavigationItem[];
};

type SiteNavigation = {
  sidebar: NavigationItem[][];
  footerLinks: NavigationItem[];
  sitemap: NavigationItem[];
};

export type SiteVisibility = {
  about: boolean;
  resume: boolean;
  portfolio: boolean;
  cases: boolean;
  contact: boolean;
  license: boolean;
  credits: boolean;
  follow: boolean;
  feed: boolean;
  writing: boolean;
  findings: boolean;
  topics: boolean;
  collections: boolean;
  snippets: boolean;
  rightSidebar: boolean;
};

type SiteBuild = {
  commitSha?: string;
};

export type SiteText = WithSeo & {
  shortName: string;
  portfolioUrl?: string;
  copyrightTemplate: string;
  maintenanceEnabled: boolean;
  maintenance: MaintenanceContent;
  contact: ContactInformation;
  sourceRepositoryUrl?: string;
  navigation?: SiteNavigation;
  visibility?: SiteVisibility;
  build?: SiteBuild;
};
