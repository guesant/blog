import type { ReactNode } from 'react';
import { SidebarContentColumnFrame } from '../../ui';
import { SidebarContentFooter } from './sidebar-content-footer';

type SidebarContentColumnProps = { children: ReactNode; copyright: string };

export function SidebarContentColumn(props: SidebarContentColumnProps) {
  return (
    <SidebarContentColumnFrame>
      {props.children}
      <SidebarContentFooter copyright={props.copyright} />
    </SidebarContentColumnFrame>
  );
}
