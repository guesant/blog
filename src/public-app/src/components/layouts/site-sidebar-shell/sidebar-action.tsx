'use client';

import { SidebarActionButton } from '../../ui';
import type { ElementType, ReactNode } from 'react';

type SidebarActionProps = {
  label: ReactNode;
  icon?: ReactNode;
  endIcon?: ReactNode;
  href: string;
  component: ElementType;
  target?: string;
  rel?: string;
  onClick?: () => void;
  active?: boolean;
  ariaCurrent?: 'page';
};

export function SidebarAction(props: SidebarActionProps) {
  return <SidebarActionButton {...props} />;
}
