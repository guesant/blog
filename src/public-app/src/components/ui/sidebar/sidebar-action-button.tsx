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

const baseStyles = {
  justifyContent: 'flex-start',
  textAlign: 'left',
  '& .MuiButton-endIcon': { marginLeft: 'auto' },
  width: '100%',
  minWidth: 0,
  padding: 'var(--site-action-py) var(--site-space-3)',
  color: 'var(--site-primary-muted)',
  borderColor: 'var(--site-primary-muted)',
  '&:hover': {
    color: 'var(--site-primary)',
    borderColor: 'var(--site-primary)',
    backgroundColor: 'var(--site-surface-hover)',
  },
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
      siteVariant="default"
      sx={{ ...baseStyles, ...(props.active ? activeStyles : {}) }}
    >
      {props.label}
    </Button>
  );
}
