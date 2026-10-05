import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarMainColumnFrameProps = { children: ReactNode };

const styles = {
  minWidth: 0,
  minHeight: 'var(--site-viewport-min-height)',
  display: 'flex',
  flexDirection: 'column',
};

export function SidebarMainColumnFrame(props: SidebarMainColumnFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
