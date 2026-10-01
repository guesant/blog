import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarNavigationExpandedStackProps = { children: ReactNode };

export function SidebarNavigationExpandedStack(props: SidebarNavigationExpandedStackProps) {
  return (
    <Stack
      sx={{ width: '100%', flexShrink: 0, gap: 'var(--site-sidebar-gap)', flex: 1, minHeight: 0 }}
    >
      {props.children}
    </Stack>
  );
}
