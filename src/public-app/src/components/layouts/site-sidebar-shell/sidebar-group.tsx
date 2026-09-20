'use client';

import { Box, Divider, Typography } from '../../ui';
import { Stack } from '../../ui';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';
import { visibleRoute } from './visible-route';
import { SidebarNavItem } from './sidebar-nav-item';
import { ConditionalContent } from '../../primitives/conditional-content';

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
    <Box>
      <Divider visualVariant="sidebarGroup" />
      <ConditionalContent
        condition={Boolean(label)}
        content={
          <Typography variant="overline" color="text.secondary">
            {label}
          </Typography>
        }
      />
      <Stack visualVariant="sidebarGroup">
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
      </Stack>
    </Box>
  );
}
