import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarPreferencesFrameProps = { children: ReactNode };

const styles = { marginTop: 'var(--site-sidebar-gap)' };

export function SidebarPreferencesFrame(props: SidebarPreferencesFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
