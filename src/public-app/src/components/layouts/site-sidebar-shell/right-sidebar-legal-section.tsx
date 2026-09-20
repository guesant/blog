import { ConditionalContent } from '../../primitives/conditional-content';
import { SidebarLinkList } from './sidebar-link-list';
import { SidebarSection } from './sidebar-section';
import type { NavigationItem } from '@portfolio/data/domain/types';

type RightSidebarLegalSectionProps = {
  visible: boolean;
  items: NavigationItem[];
  label: string;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
};

export function RightSidebarLegalSection(props: RightSidebarLegalSectionProps) {
  return (
    <ConditionalContent
      condition={props.visible}
      content={
        <SidebarSection label={props.label}>
          <SidebarLinkList
            items={props.items}
            pathname={props.pathname}
            locale={props.locale}
            onNavigate={props.onNavigate}
          />
        </SidebarSection>
      }
    />
  );
}
