import type { ReactNode } from 'react';
import { SidebarLayoutWithRightSidebarFrame } from './sidebar-layout-with-right-sidebar-frame';
import { SidebarLayoutWithoutRightSidebarFrame } from './sidebar-layout-without-right-sidebar-frame';

type SidebarLayoutFrameProps = { children: ReactNode; withRightSidebar: boolean };

export function SidebarLayoutFrame(props: SidebarLayoutFrameProps) {
  if (props.withRightSidebar) {
    return <SidebarLayoutWithRightSidebarFrame children={props.children} />;
  }

  return <SidebarLayoutWithoutRightSidebarFrame children={props.children} />;
}
