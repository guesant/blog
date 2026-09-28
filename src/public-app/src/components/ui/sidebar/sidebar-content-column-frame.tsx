import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarContentColumnFrameProps = { children: ReactNode };

const styles = {
  width: 'min(100%, var(--site-page-max))',
  minHeight: '100%',
  marginInline: 'auto',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 'var(--site-space-6)',
  backgroundColor: 'var(--grid-background)',
  borderLeft: 'var(--site-border-width) solid var(--site-border)',
  borderRight: 'var(--site-border-width) solid var(--site-border)',
};

export function SidebarContentColumnFrame(props: SidebarContentColumnFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
