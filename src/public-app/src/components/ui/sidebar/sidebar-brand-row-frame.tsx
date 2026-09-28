import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarBrandRowFrameProps = { children: ReactNode };

const styles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minHeight: 'var(--site-control-h)',
};

export function SidebarBrandRowFrame(props: SidebarBrandRowFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
