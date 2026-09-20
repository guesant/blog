import type { NavigationAvailability, Profile, SiteText } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';

export type SiteSidebarShellProps = {
  children: ReactNode;
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
};

export const aboutRoutes = ['resume', 'portfolio', 'cases'];
