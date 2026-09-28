import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarRightStackFrameProps = { children: ReactNode };

const styles = { gap: 'var(--site-sidebar-gap)' };

export function SidebarRightStackFrame(props: SidebarRightStackFrameProps) {
  return <Stack sx={styles}>{props.children}</Stack>;
}
