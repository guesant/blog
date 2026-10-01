import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarRightColumnMobileFrameProps = { children: ReactNode };

export function SidebarRightColumnMobileFrame(props: SidebarRightColumnMobileFrameProps) {
  return (
    <Box component="aside" sx={{ minWidth: 0, padding: 0 }}>
      {props.children}
    </Box>
  );
}
