import { Link } from '../link';
import type { ProtectedEmailInlineActionVariantProps } from './protected-email-inline-action-types';

export type ProtectedEmailTriggerBusyInlineActionProps = ProtectedEmailInlineActionVariantProps;

const busyStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
  border: 0,
  padding: 0,
  background: 'none',
  cursor: 'progress',
  font: 'inherit',
};

export function ProtectedEmailTriggerBusyInlineAction(
  props: ProtectedEmailTriggerBusyInlineActionProps,
) {
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
      sx={busyStyles}
    >
      {props.children}
    </Link>
  );
}
