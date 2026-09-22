import type { NavigationAvailability, Profile, SiteText } from '@portfolio/data/domain/types';
import type { ShellData } from './content-data-support';

const fallbackProfile: Profile = {
  name: 'Gabriel R. Antunes',
  title: 'Software developer',
  location: 'Brazil',
  description: '',
  interests: '',
  learning: '',
  personalInterests: [],
  trajectory: [],
  milestones: [],
};

const fallbackSite: SiteText = {
  shortName: 'guesant.net',
  copyrightTemplate: '© {year} Gabriel R. Antunes. Some rights reserved.',
  maintenanceEnabled: false,
  maintenance: { eyebrow: 'Maintenance', title: 'Temporarily unavailable', description: '' },
  contact: { hasEmail: false, profiles: [], available: false },
  visibility: {
    about: false,
    resume: false,
    portfolio: false,
    cases: false,
    contact: false,
    license: false,
    credits: false,
    follow: false,
    feed: false,
    writing: false,
    findings: false,
    topics: false,
    collections: false,
    snippets: false,
    rightSidebar: false,
  },
};

const fallbackAvailability: NavigationAvailability = {
  cases: false,
  projects: false,
  writing: false,
  achados: false,
  contact: false,
};

export const fallbackShellData: ShellData = {
  profile: fallbackProfile,
  site: fallbackSite,
  availability: fallbackAvailability,
};
