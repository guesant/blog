import type { ReactNode } from 'react';
import { SidebarNavigationCompactStack } from './sidebar-navigation-compact-stack';
import { SidebarNavigationExpandedStack } from './sidebar-navigation-expanded-stack';

type SidebarNavigationStackProps = { children: ReactNode; compact: boolean };

export function SidebarNavigationStack(props: SidebarNavigationStackProps) {
  if (props.compact) {
    return <SidebarNavigationCompactStack children={props.children} />;
  }

  return <SidebarNavigationExpandedStack children={props.children} />;
}
