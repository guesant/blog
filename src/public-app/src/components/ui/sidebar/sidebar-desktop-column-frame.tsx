import type { ReactNode } from 'react';
import { SidebarDesktopLeftColumnFrame } from './sidebar-desktop-left-column-frame';
import { SidebarDesktopRightColumnFrame } from './sidebar-desktop-right-column-frame';

type SidebarDesktopColumnFrameProps = { children: ReactNode; side: 'left' | 'right' };

export function SidebarDesktopColumnFrame(props: SidebarDesktopColumnFrameProps) {
  if (props.side === 'left') {
    return <SidebarDesktopLeftColumnFrame children={props.children} />;
  }

  return <SidebarDesktopRightColumnFrame children={props.children} />;
}
