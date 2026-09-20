import { ConditionalContent } from '../../primitives/conditional-content';
import { SidebarNavItem } from './sidebar-nav-item';
import { SidebarSection } from './sidebar-section';
import type { NavigationItem, SiteText } from '@portfolio/data/domain/types';

type RightSidebarUpdatesSectionProps = {
  visible: boolean;
  item: NavigationItem;
  label: string;
  pathname: string;
  locale: string;
  site: SiteText;
  onNavigate?: () => void;
};

export function RightSidebarUpdatesSection(props: RightSidebarUpdatesSectionProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <SidebarSection label={props.label}>
          <SidebarNavItem
            item={props.item}
            pathname={props.pathname}
            locale={props.locale}
            site={props.site}
            onNavigate={props.onNavigate}
          />
        </SidebarSection>
      }
    />
  );
}
