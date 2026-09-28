import { SidebarMobileTopbarFrame } from '../../ui';
import type { SidebarTranslator } from '@/i18n/compat-support';
import { MobileNavigationButton } from './mobile-navigation-button';
import { SidebarBrandLink } from './sidebar-brand-link';

type MobileSidebarTopbarProps = {
  onOpen: () => void;
  t: SidebarTranslator;
};

export function MobileSidebarTopbar(props: MobileSidebarTopbarProps) {
  return (
    <SidebarMobileTopbarFrame>
      <SidebarBrandLink />
      <MobileNavigationButton onOpen={props.onOpen} t={props.t} />
    </SidebarMobileTopbarFrame>
  );
}
