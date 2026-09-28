import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarMobileBrandHeaderFrameProps = { children: ReactNode };

const styles = {
  display: 'flex',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'var(--site-control-h)',
  minWidth: 0,
  '& > a': { minWidth: 0, maxWidth: '100%' },
};

export function SidebarMobileBrandHeaderFrame(props: SidebarMobileBrandHeaderFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
