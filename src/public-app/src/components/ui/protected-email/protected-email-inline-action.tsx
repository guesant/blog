import type { ReactNode } from 'react';
import { Link, type LinkProps } from '../link';

type ProtectedEmailInlineActionMode = 'revealed' | 'trigger' | 'triggerBusy';

type ProtectedEmailInlineActionProps = {
  mode: ProtectedEmailInlineActionMode;
  onClick: () => void;
  disabled?: boolean;
  ref?: (element: HTMLElement | null) => void;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  variant?: LinkProps['variant'];
  children: ReactNode;
};

const baseStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
};

const triggerStyles = {
  ...baseStyles,
  border: 0,
  padding: 0,
  background: 'none',
  cursor: 'pointer',
  font: 'inherit',
};

const busyStyles = { ...triggerStyles, cursor: 'progress' };

const modeStyles = {
  revealed: baseStyles,
  trigger: triggerStyles,
  triggerBusy: busyStyles,
} satisfies Record<ProtectedEmailInlineActionMode, typeof baseStyles>;

export function ProtectedEmailInlineAction(props: ProtectedEmailInlineActionProps) {
  const sx = modeStyles[props.mode];

  return (
    <Link
      component="button"
      type="button"
      ref={props.ref}
      onClick={props.onClick}
      disabled={props.disabled}
      color={props.color}
      underline={props.underline}
      variant={props.variant}
      sx={sx}
    >
      {props.children}
    </Link>
  );
}
