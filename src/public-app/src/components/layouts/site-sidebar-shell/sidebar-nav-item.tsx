'use client';

import { Box } from '../../ui';
import { Stack } from '../../ui';
import { sidebarSubnavVisualVariant } from '../sidebar-action';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';
import { visibleRoute } from './visible-route';
import { SidebarLink } from './sidebar-link';
import { SidebarNavChild } from './sidebar-nav-child';
import { ConditionalContent } from '../../primitives/conditional-content';

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
    <Box>
      <SidebarLink item={item} pathname={pathname} locale={locale} onNavigate={onNavigate} />
      <ConditionalContent
        condition={visibleChildren.length > 0}
        content={
          <Stack visualVariant={sidebarSubnavVisualVariant}>
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
          </Stack>
        }
      />
    </Box>
  );
}
