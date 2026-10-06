'use client';

import { SidebarSubnavigationFrame } from '../../ui';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';
import { visibleRoute } from '../../navigation/visible-route';
import { SidebarLink } from './sidebar-link';
import { SidebarNavChild } from './sidebar-nav-child';
import { ConditionalContent } from '../../primitives/conditional-content';
import { SidebarNavItemFrame } from '../../ui/semantic/SidebarNavItemFrame';

type SidebarNavItemProps = {
  item: NavigationItem;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function SidebarNavItem(props: SidebarNavItemProps) {
  const { item, pathname, locale, site, onNavigate } = props;

  const visibleChildren = item.children.filter((child) => visibleRoute(child.route, site));

  return (
    <SidebarNavItemFrame>
      <SidebarLink item={item} pathname={pathname} locale={locale} onNavigate={onNavigate} />
      <ConditionalContent
        condition={visibleChildren.length > 0}
        content={
          <SidebarSubnavigationFrame>
            {visibleChildren.map((child) => (
              <SidebarNavChild
                key={child.route}
                item={child}
                pathname={pathname}
                locale={locale}
                site={site}
                onNavigate={onNavigate}
              />
            ))}
          </SidebarSubnavigationFrame>
        }
      />
    </SidebarNavItemFrame>
  );
}
