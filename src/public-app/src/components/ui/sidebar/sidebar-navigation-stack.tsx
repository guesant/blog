import type { ReactNode } from 'react';
import { Stack } from '../stack';

type SidebarNavigationStackProps = { children: ReactNode; compact: boolean };

export function SidebarNavigationStack(props: SidebarNavigationStackProps) {
  return (
    <Stack
      sx={{
        gap: 'var(--site-sidebar-gap)',
        flex: props.compact ? undefined : 1,
        minHeight: props.compact ? undefined : 0,
      }}
    >
      {props.children}
    </Stack>
  );
}
