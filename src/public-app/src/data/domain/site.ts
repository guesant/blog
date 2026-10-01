import type { ProtectedEmailChallenge } from './protected-email/types.ts';

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
  enabled: boolean;
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

export type SidebarGroup = {
  key: string;
  label?: string;
  items: NavigationItem[];
};

type SiteNavigation = {
  sidebar: SidebarGroup[];
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

export type SiteFeatureFlags = {
  contentActions: {
    copyText: boolean;
    copyUrl: boolean;
    downloadText: boolean;
  };
  contextualCursor: boolean;
  feed: {
    flatCards: boolean;
  };
};

type SiteBuild = {
  commitSha?: string;
};

export type SiteText = {
  shortName: string;
  portfolioUrl?: string;
  copyrightTemplate: string;
  maintenanceEnabled: boolean;
  maintenance: MaintenanceContent;
  contact: ContactInformation;
  sourceRepositoryUrl?: string;
  featureFlags: SiteFeatureFlags;
  navigation?: SiteNavigation;
  visibility?: SiteVisibility;
  build?: SiteBuild;
};
