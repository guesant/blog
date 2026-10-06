import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarMobileTopbarFrameProps = { children: ReactNode };

const styles = {
  display: { xs: 'flex', md: 'none' },
  position: 'sticky',
  top: 0,
  zIndex: 'var(--site-z-nav)',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: 'var(--site-topbar-h)',
  paddingInline: 'var(--site-space-3)',
  borderBottom: 'var(--site-border-width) solid var(--site-border)',
  backgroundColor: 'var(--site-surface)',
};

export function SidebarMobileTopbarFrame(props: SidebarMobileTopbarFrameProps) {
  return (
    <Box data-navigation-sidebar sx={styles}>
      {props.children}
    </Box>
  );
}
