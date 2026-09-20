import { Divider, Stack } from '../../ui';
import { SidebarBrandRow } from './sidebar-brand-row';
import { SidebarLinkList } from './sidebar-link-list';
import { LeftSidebarAboutGroup } from './left-sidebar-about-group';
import { LeftSidebarContentGroups } from './left-sidebar-content-groups';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';

type LeftSidebarMainNavigationProps = {
  backHref?: string;
  backLabel: string;
  homeItem: NavigationItem;
  contentGroups: NavigationItem[][];
  aboutVisible: boolean;
  aboutItem: NavigationItem;
  groupLabel: (items: NavigationItem[]) => string;
  t: (key: string) => string;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
  compact?: boolean;
};

export function LeftSidebarMainNavigation(props: LeftSidebarMainNavigationProps) {
  return (
    <Stack visualVariant={props.compact ? 'sidebarNavStackCompact' : 'sidebarNavStack'}>
      <SidebarBrandRow backHref={props.backHref} backLabel={props.backLabel} />
      <Divider />
      <SidebarLinkList
        items={[props.homeItem]}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onNavigate}
      />
      <LeftSidebarContentGroups
        groups={props.contentGroups}
        groupLabel={props.groupLabel}
        t={props.t}
        pathname={props.pathname}
        locale={props.locale}
        site={props.site}
        onNavigate={props.onNavigate}
      />
      <LeftSidebarAboutGroup
        visible={props.aboutVisible}
        item={props.aboutItem}
        pathname={props.pathname}
        locale={props.locale}
        site={props.site}
        onNavigate={props.onNavigate}
      />
    </Stack>
  );
}
