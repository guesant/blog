'use client';

import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';
import { SidebarNavItem } from './sidebar-nav-item';

type SidebarNavChildProps = {
  item: NavigationItem;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function SidebarNavChild(props: SidebarNavChildProps) {
  return <SidebarNavItem {...props} />;
}
