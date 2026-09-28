import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarRightColumnFrameProps = { children: ReactNode; mobile: boolean };

export function SidebarRightColumnFrame(props: SidebarRightColumnFrameProps) {
  return (
    <Box component="aside" sx={{ minWidth: 0, padding: props.mobile ? 0 : 'var(--site-space-4)' }}>
      {props.children}
    </Box>
  );
}
