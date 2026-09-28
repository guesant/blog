import { ProtectedEmailRevealedButton } from '../../ui';
import type { RevealedEmailProps } from './types';

type RevealedEmailButtonProps = RevealedEmailProps;

export function RevealedEmailButton(props: RevealedEmailButtonProps) {
  return (
    <ProtectedEmailRevealedButton
      presentation="contact"
      email={props.email}
      label={props.label}
      showAddress={props.showAddress}
      onReveal={props.onReveal}
      ref={props.ref}
    />
  );
}
