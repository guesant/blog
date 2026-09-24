'use client';

import { Link as LocaleLink } from '../../../i18n/navigation';
import { Icon } from '../../primitives/icon';
import type { NavigationItem } from '@portfolio/data/domain/types';
import { internalRoute } from './internal-route';
import { isResourceRoute } from './is-resource-route';
import { iconForRoute } from './icon-for-route';
import { activeRoute } from './active-route';
import { SidebarAction } from './sidebar-action';

type SidebarLinkProps = {
  item: NavigationItem;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
};

export function SidebarLink(props: SidebarLinkProps) {
  const { item, pathname, locale, onNavigate } = props;

  const route = internalRoute(item.route, locale);

  const active = activeRoute(pathname, route);

  const icon = iconForRoute(route);

  const resourceRoute = isResourceRoute(route);

  return (
    <SidebarAction
      component={resourceRoute ? 'a' : LocaleLink}
      href={resourceRoute ? item.route : route}
      onClick={onNavigate}
      icon={icon ? <Icon name={icon} size={14} /> : undefined}
      active={active}
      ariaCurrent={active ? 'page' : undefined}
      label={item.label}
    />
  );
}
