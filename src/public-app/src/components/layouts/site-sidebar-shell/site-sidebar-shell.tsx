'use client';

import { Box } from '../../ui';
import { useLocale } from '@/i18n/compat';
import { useState } from 'react';
import { usePathname } from '../../../i18n/navigation';
import type { SiteSidebarShellProps } from './types';
import { DesktopLeftSidebar } from './desktop-left-sidebar';
import { DesktopRightSidebar } from './desktop-right-sidebar';
import { MobileSidebarSlot } from './mobile-sidebar-slot';
import { SidebarMainColumn } from './sidebar-main-column';

export function SiteSidebarShell(props: SiteSidebarShellProps) {
  const { children, profile, site } = props;

  const pathname = usePathname();

  const locale = useLocale();

  const [open, setOpen] = useState(false);

  const showRight = site.visibility?.rightSidebar ?? true;

  const copyright = site.copyrightTemplate
    .replace('{year}', String(new Date().getFullYear()))
    .replace('{name}', profile.name);

  return (
    <Box visualVariant={showRight ? 'siteSidebarShell' : 'siteSidebarShellWithoutRight'}>
      <DesktopLeftSidebar site={site} pathname={pathname} locale={locale} />
      <SidebarMainColumn copyright={copyright} onOpen={() => setOpen(true)}>
        {children}
      </SidebarMainColumn>
      <DesktopRightSidebar
        visible={showRight}
        site={site}
        profile={profile}
        pathname={pathname}
        locale={locale}
      />
      <MobileSidebarSlot
        open={open}
        showRight={showRight}
        onClose={() => setOpen(false)}
        site={site}
        profile={profile}
        pathname={pathname}
        locale={locale}
      />
    </Box>
  );
}
