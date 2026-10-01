import type { ReactNode } from 'react';
import { SidebarNavigationCompactFrame } from './sidebar-navigation-compact-frame';
import { SidebarNavigationExpandedFrame } from './sidebar-navigation-expanded-frame';

type SidebarNavigationFrameProps = {
  children: ReactNode;
  compact: boolean;
  'aria-label'?: string;
};

export function SidebarNavigationFrame(props: SidebarNavigationFrameProps) {
  const contentProps = { children: props.children, 'aria-label': props['aria-label'] };

  if (props.compact) {
    return <SidebarNavigationCompactFrame {...contentProps} />;
  }

  return <SidebarNavigationExpandedFrame {...contentProps} />;
}
