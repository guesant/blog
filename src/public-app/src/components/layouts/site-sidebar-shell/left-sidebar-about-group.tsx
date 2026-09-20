import { ConditionalContent } from '../../primitives/conditional-content';
import { SidebarGroup } from './sidebar-group';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';

type LeftSidebarAboutGroupProps = {
  visible: boolean;
  item: NavigationItem;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function LeftSidebarAboutGroup(props: LeftSidebarAboutGroupProps) {
  return (
    <ConditionalContent
      condition={props.visible && props.item.children.length > 0}
      content={
        <SidebarGroup
          items={[props.item]}
          pathname={props.pathname}
          locale={props.locale}
          site={props.site}
          onNavigate={props.onNavigate}
        />
      }
    />
  );
}
