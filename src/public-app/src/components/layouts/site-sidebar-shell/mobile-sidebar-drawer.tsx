import { Drawer } from '../../ui';
import { MobileSidebarStack } from './mobile-sidebar-stack';
import type { SidebarLayoutProps } from './sidebar-layout.types';

type MobileSidebarDrawerProps = SidebarLayoutProps & {
  open: boolean;
  showRight: boolean;
  onClose: () => void;
};

export function MobileSidebarDrawer(props: MobileSidebarDrawerProps) {
  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose} visualVariant="mobileSidebar">
      <MobileSidebarStack {...props} />
    </Drawer>
  );
}
