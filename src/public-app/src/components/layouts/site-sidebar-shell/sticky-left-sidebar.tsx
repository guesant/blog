import { Box } from '../../ui';
import { LeftSidebar } from './left-sidebar';
import type { SidebarLayoutProps } from './sidebar-layout.types';

type StickyLeftSidebarProps = Omit<SidebarLayoutProps, 'profile'>;

export function StickyLeftSidebar(props: StickyLeftSidebarProps) {
  return (
    <Box visualVariant="stickyLeftSidebar">
      <LeftSidebar site={props.site} pathname={props.pathname} locale={props.locale} />
    </Box>
  );
}
