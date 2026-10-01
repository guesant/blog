import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarNavigationCompactStackProps = { children: ReactNode };

export function SidebarNavigationCompactStack(props: SidebarNavigationCompactStackProps) {
  return (
    <Stack sx={{ width: '100%', flexShrink: 0, gap: 'var(--site-sidebar-gap)' }}>
      {props.children}
    </Stack>
  );
}
