import type { Profile, SiteText } from '@portfolio/data/domain/types';

export type SidebarLayoutProps = {
  profile: Profile;
  site: SiteText;
  pathname: string;
  locale: string;
};
