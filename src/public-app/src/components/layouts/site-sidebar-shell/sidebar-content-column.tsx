import type { ReactNode } from 'react';
import { Box } from '../../ui';
import { SidebarContentFooter } from './sidebar-content-footer';

type SidebarContentColumnProps = { children: ReactNode; copyright: string };

export function SidebarContentColumn(props: SidebarContentColumnProps) {
  return (
    <Box visualVariant="sidebarContentColumn">
      {props.children}
      <SidebarContentFooter copyright={props.copyright} />
    </Box>
  );
}
