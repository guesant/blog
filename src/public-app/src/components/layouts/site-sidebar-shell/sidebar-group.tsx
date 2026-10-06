'use client';

import { SidebarGroupFrame } from '../../ui';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';
import { visibleRoute } from '../../navigation/visible-route';
import { SidebarNavItem } from './sidebar-nav-item';

type SidebarGroupProps = {
  label?: string;
  items: NavigationItem[];
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function SidebarGroup(props: SidebarGroupProps) {
  const { label, items, pathname, locale, site, onNavigate } = props;

  const visibleItems = items.filter((item) => visibleRoute(item.route, site));

  if (!visibleItems.length) {
    return null;
  }
  return (
    <SidebarGroupFrame label={label}>
      {visibleItems.map((item) => (
        <SidebarNavItem
          key={item.route}
          item={item}
          pathname={pathname}
          locale={locale}
          site={site}
          onNavigate={onNavigate}
        />
      ))}
    </SidebarGroupFrame>
  );
}
