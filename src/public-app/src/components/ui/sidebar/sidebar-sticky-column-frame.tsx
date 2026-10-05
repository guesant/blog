import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarStickyColumnFrameProps = { children: ReactNode };

const styles = {
  position: 'sticky',
  top: 0,
  height: 'var(--site-viewport-height)',
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
};

export function SidebarStickyColumnFrame(props: SidebarStickyColumnFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
