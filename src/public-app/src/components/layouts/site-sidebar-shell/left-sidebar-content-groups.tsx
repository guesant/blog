import { SidebarGroup } from './sidebar-group';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';
import type { SidebarTranslationKey, SidebarTranslator } from '@/i18n/compat-support';

type LeftSidebarContentGroupsProps = {
  groups: NavigationItem[][];
  groupLabel: (items: NavigationItem[]) => SidebarTranslationKey;
  t: SidebarTranslator;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function LeftSidebarContentGroups(props: LeftSidebarContentGroupsProps) {
  return (
    <>
      {props.groups.map((items, index) => (
        <SidebarGroup
          key={index}
          label={props.t(props.groupLabel(items))}
          items={items}
          pathname={props.pathname}
          locale={props.locale}
          site={props.site}
          onNavigate={props.onNavigate}
        />
      ))}
    </>
  );
}
