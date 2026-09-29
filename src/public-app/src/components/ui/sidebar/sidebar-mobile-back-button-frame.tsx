import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarMobileBackButtonFrameProps = { children: ReactNode };

const styles = {
  position: 'absolute',
  insetInlineStart: 0,
  insetBlockStart: '50%',
  display: 'inline-flex',
  transform: 'translateY(-50%)',
};

export function SidebarMobileBackButtonFrame(props: SidebarMobileBackButtonFrameProps) {
  return <Box sx={styles}>{props.children}</Box>;
}
