import type { ReactNode } from 'react';
import { Box } from '../../ui';
import { SidebarContentColumn } from './sidebar-content-column';

type SidebarMainContentProps = { children: ReactNode; copyright: string };

export function SidebarMainContent(props: SidebarMainContentProps) {
  return (
    <Box component="main" visualVariant="sidebarMainContent">
      <SidebarContentColumn copyright={props.copyright}>{props.children}</SidebarContentColumn>
    </Box>
  );
}
