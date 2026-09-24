import { Link } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealedEmailProps } from './types';

type RevealedEmailInlineProps = RevealedEmailProps;

export function RevealedEmailInline(props: RevealedEmailInlineProps) {
  return (
    <Link
      ref={props.ref}
      component="button"
      type="button"
      onClick={props.onReveal}
      color={props.color}
      underline={props.underline}
      variant={props.typographyVariant}
      visualVariant={props.visualVariant ?? 'protectedEmailInlineRevealed'}
    >
      <Icon name="mail" size={16} />
      {props.showAddress ? props.email : props.label}
    </Link>
  );
}
