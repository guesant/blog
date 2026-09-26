import { SidebarLinkList } from './sidebar-link-list';
import { RightSidebarConditionalSection } from './right-sidebar-conditional-section';
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
    <RightSidebarConditionalSection visible={props.visible} label={props.label}>
      <SidebarLinkList
        items={props.items}
        pathname={props.pathname}
        locale={props.locale}
        onNavigate={props.onNavigate}
      />
    </RightSidebarConditionalSection>
  );
}
