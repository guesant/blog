import type {
  InterfaceMessages,
  NavigationAvailability,
  Profile,
  SiteText,
} from '@portfolio/data/domain/types';
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

const fallbackMessages: InterfaceMessages = {
  Nav: {
    home: 'Home',
    about: 'About me',
    skipToContent: 'Skip to content',
  },
  Sidebar: {
    navigation: 'Navigation',
    preferences: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    systemTheme: 'System',
    lightTheme: 'Light',
    darkTheme: 'Dark',
  },
  Pages: {
    error: {
      eyebrow: 'Error',
      title: 'Content temporarily unavailable',
      description: 'The content service is unavailable. Please try again shortly.',
      home: 'Home',
      retry: 'Retry',
      issue: 'Report issue',
    },
  },
};

export const fallbackShellData: ShellData = {
  profile: fallbackProfile,
  site: fallbackSite,
  availability: fallbackAvailability,
  messages: fallbackMessages,
};
