import { Divider, SidebarNavigationStack } from '../../ui';
import { SidebarBrandRow } from './sidebar-brand-row';
import { SidebarLinkList } from './sidebar-link-list';
import { LeftSidebarAboutGroup } from './left-sidebar-about-group';
import { LeftSidebarContentGroups } from './left-sidebar-content-groups';
import type { NavigationItem, SidebarGroup, SiteText } from '@portfolio/data/domain/types';

type LeftSidebarMainNavigationProps = {
  homeItem: NavigationItem;
  contentGroups: SidebarGroup[];
  aboutVisible: boolean;
  aboutItem: NavigationItem;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
  compact?: boolean;
  showBrand?: boolean;
};

export function LeftSidebarMainNavigation(props: LeftSidebarMainNavigationProps) {
  return (
    <SidebarNavigationStack compact={Boolean(props.compact)}>
      {props.showBrand !== false && <SidebarBrandRow />}
      <Divider />
      <SidebarLinkList
        items={[props.homeItem]}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onNavigate}
      />
      <LeftSidebarContentGroups
        groups={props.contentGroups}
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
    </SidebarNavigationStack>
  );
}
