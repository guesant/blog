import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarMobileStackFrameProps = { children: ReactNode };

const styles = {
  overflowY: 'auto',
  gap: 'var(--site-sidebar-gap)',
  padding: 'var(--site-space-3)',
};

export function SidebarMobileStackFrame(props: SidebarMobileStackFrameProps) {
  return <Stack sx={styles}>{props.children}</Stack>;
}
