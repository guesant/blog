import { Link } from '../link';
import type { ProtectedEmailInlineActionVariantProps } from './protected-email-inline-action-types';

export type ProtectedEmailRevealedInlineActionProps = ProtectedEmailInlineActionVariantProps;

const revealedStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
};

export function ProtectedEmailRevealedInlineAction(props: ProtectedEmailRevealedInlineActionProps) {
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
      sx={revealedStyles}
    >
      {props.children}
    </Link>
  );
}
