import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarContactProfilesFrameProps = { children: ReactNode };

const styles = {
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  gap: 'var(--site-sidebar-gap)',
  marginLeft: 'var(--site-space-3)',
  paddingLeft: 'var(--site-space-3)',
  borderLeft: 'var(--site-border-width) solid',
  borderColor: 'divider',
};

export function SidebarContactProfilesFrame(props: SidebarContactProfilesFrameProps) {
  return <Stack sx={styles}>{props.children}</Stack>;
}
