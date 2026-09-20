import type { ReactNode } from 'react';
import type { NavigationAvailability, Profile, SiteText } from '@portfolio/data/domain/types';
import { SiteMainContent } from './site-main-content';
import { SiteSidebarShell } from './site-sidebar-shell';

type SiteShellFrameProps = {
  children: ReactNode;
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
};

export function SiteShellFrame(props: SiteShellFrameProps) {
  return (
    <SiteSidebarShell profile={props.profile} site={props.site} availability={props.availability}>
      <SiteMainContent>{props.children}</SiteMainContent>
    </SiteSidebarShell>
  );
}
