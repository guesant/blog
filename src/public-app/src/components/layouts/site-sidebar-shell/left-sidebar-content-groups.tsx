import { SidebarGroup } from './sidebar-group';
import type { SidebarGroup as SidebarGroupData, SiteText } from '@portfolio/data/domain/types';

type LeftSidebarContentGroupsProps = {
  groups: SidebarGroupData[];
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function LeftSidebarContentGroups(props: LeftSidebarContentGroupsProps) {
  return (
    <>
      {props.groups.map((group) => (
        <SidebarGroup
          key={group.key}
          label={group.label}
          items={group.items}
          pathname={props.pathname}
          locale={props.locale}
          site={props.site}
          onNavigate={props.onNavigate}
        />
      ))}
    </>
  );
}
