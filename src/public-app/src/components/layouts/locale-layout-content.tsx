import type { ReactNode } from 'react';
import type { ShellData } from '@portfolio/data/queries';
import { MaintenancePage } from './maintenance-page';
import { SiteShell } from './site-shell';

export type LocaleLayoutContentProps = {
  shell: ShellData;
  children: ReactNode;
};

export function LocaleLayoutContent(props: LocaleLayoutContentProps) {
  return props.shell.site.maintenanceEnabled ? (
    <MaintenancePage site={props.shell.site} profile={props.shell.profile} />
  ) : (
    <SiteShell
      profile={props.shell.profile}
      site={props.shell.site}
      availability={props.shell.availability}
      children={props.children}
    />
  );
}
