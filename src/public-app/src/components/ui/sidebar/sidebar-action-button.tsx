import type { ElementType, ReactNode } from 'react';
import { Button } from '../button';

type SidebarActionButtonProps = {
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

const activeStyles = {
  backgroundColor: 'var(--site-accent-bg)',
  '&:hover': {
    color: 'var(--site-primary)',
    backgroundColor: 'var(--site-accent-bg)',
  },
};

export function SidebarActionButton(props: SidebarActionButtonProps) {
  return (
    <Button
      component={props.component}
      href={props.href}
      onClick={props.onClick}
      target={props.target}
      rel={props.rel}
      startIcon={props.icon}
      endIcon={props.endIcon}
      aria-current={props.ariaCurrent}
      siteVariant="sidebar"
      sx={props.active ? [{ flexShrink: 0 }, activeStyles] : { flexShrink: 0 }}
    >
      {props.label}
    </Button>
  );
}
