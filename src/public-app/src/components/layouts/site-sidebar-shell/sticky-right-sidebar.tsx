import { Box } from '../../ui';
import { RightSidebar } from './right-sidebar';
import type { SidebarLayoutProps } from './sidebar-layout.types';

type StickyRightSidebarProps = SidebarLayoutProps;

export function StickyRightSidebar(props: StickyRightSidebarProps) {
  return (
    <Box visualVariant="stickyRightSidebar">
      <RightSidebar {...props} />
    </Box>
  );
}
