import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarRightColumnDesktopFrameProps = { children: ReactNode };

export function SidebarRightColumnDesktopFrame(props: SidebarRightColumnDesktopFrameProps) {
  return (
    <Box component="aside" sx={{ minWidth: 0, padding: 'var(--site-space-4)' }}>
      {props.children}
    </Box>
  );
}
