import type { ReactNode } from 'react';
import { SidebarMainContentFrame } from '../../ui';
import { SidebarContentColumn } from './sidebar-content-column';

type SidebarMainContentProps = { children: ReactNode; copyright: string };

export function SidebarMainContent(props: SidebarMainContentProps) {
  return (
    <SidebarMainContentFrame>
      <SidebarContentColumn copyright={props.copyright}>{props.children}</SidebarContentColumn>
    </SidebarMainContentFrame>
  );
}
