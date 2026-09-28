import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarMobileStackFrameProps = { children: ReactNode };

const styles = {
  width: '100%',
  minWidth: 0,
  minHeight: 0,
  overflowY: 'auto',
  gap: 'var(--site-sidebar-gap)',
  padding: 'var(--site-space-3)',
  alignItems: 'stretch',
  '& > *': {
    width: '100%',
    minWidth: 0,
    flex: '0 0 auto',
  },
};

export function SidebarMobileStackFrame(props: SidebarMobileStackFrameProps) {
  return <Stack sx={styles}>{props.children}</Stack>;
}
