import { SidebarDesktopColumnFrame } from '../../ui';
import { StickyLeftSidebar } from './sticky-left-sidebar';
import type { SidebarLayoutProps } from './sidebar-layout.types';

type DesktopLeftSidebarProps = Omit<SidebarLayoutProps, 'profile'>;

export function DesktopLeftSidebar(props: DesktopLeftSidebarProps) {
  return (
    <SidebarDesktopColumnFrame side="left">
      <StickyLeftSidebar {...props} />
    </SidebarDesktopColumnFrame>
  );
}
