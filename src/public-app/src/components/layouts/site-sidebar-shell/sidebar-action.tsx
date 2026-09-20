'use client';

import { Button } from '../../ui';
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
  const {
    label,
    icon,
    endIcon,
    href,
    component,
    target,
    rel,
    onClick,
    active = false,
    ariaCurrent,
  } = props;

  return (
    <Button
      component={component}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      startIcon={icon}
      endIcon={endIcon}
      aria-current={ariaCurrent}
      siteVariant="sidebar"
      visualVariant={active ? 'sidebarActionActive' : 'sidebarAction'}
    >
      {label}
    </Button>
  );
}
