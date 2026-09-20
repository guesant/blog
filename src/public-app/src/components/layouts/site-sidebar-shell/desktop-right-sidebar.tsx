import { Box } from '../../ui';
import { StickyRightSidebar } from './sticky-right-sidebar';
import type { SidebarLayoutProps } from './sidebar-layout.types';

type DesktopRightSidebarProps = SidebarLayoutProps & { visible: boolean };

export function DesktopRightSidebar(props: DesktopRightSidebarProps) {
  if (!props.visible) {
    return null;
  }
  return (
    <Box visualVariant="desktopRightSidebar">
      <StickyRightSidebar {...props} />
    </Box>
  );
}
