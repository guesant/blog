import type { ReactNode } from 'react';
import { Box } from '../box';

type SidebarNavigationFrameProps = {
  children: ReactNode;
  compact: boolean;
  'aria-label'?: string;
};

export function SidebarNavigationFrame(props: SidebarNavigationFrameProps) {
  return (
    <Box
      component="nav"
      aria-label={props['aria-label']}
      sx={{
        width: '100%',
        padding: props.compact ? 0 : 'var(--site-space-3)',
        minWidth: 0,
        minHeight: props.compact ? 0 : '100dvh',
        flex: props.compact ? '0 0 auto' : undefined,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </Box>
  );
}
