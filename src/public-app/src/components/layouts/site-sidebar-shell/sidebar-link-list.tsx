'use client';

import type { NavigationItem } from '@portfolio/data/domain/types';
import { SidebarLink } from './sidebar-link';

type SidebarLinkListProps = {
  items: NavigationItem[];
  pathname: string;
  locale: string;
  onNavigate?: () => void;
};

export function SidebarLinkList(props: SidebarLinkListProps) {
  return props.items.map((item) => (
    <SidebarLink
      key={item.route}
      item={item}
      pathname={props.pathname}
      locale={props.locale}
      onNavigate={props.onNavigate}
    />
  ));
}
