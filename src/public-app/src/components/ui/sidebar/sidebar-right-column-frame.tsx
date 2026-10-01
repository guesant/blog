import type { ReactNode } from 'react';
import { SidebarRightColumnDesktopFrame } from './sidebar-right-column-desktop-frame';
import { SidebarRightColumnMobileFrame } from './sidebar-right-column-mobile-frame';

type SidebarRightColumnFrameProps = { children: ReactNode; mobile: boolean };

export function SidebarRightColumnFrame(props: SidebarRightColumnFrameProps) {
  if (props.mobile) {
    return <SidebarRightColumnMobileFrame children={props.children} />;
  }

  return <SidebarRightColumnDesktopFrame children={props.children} />;
}
