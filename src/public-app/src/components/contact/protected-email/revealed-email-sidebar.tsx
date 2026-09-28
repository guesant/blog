import { ProtectedEmailRevealedButton } from '../../ui';
import type { RevealedEmailProps } from './types';

type RevealedEmailSidebarProps = RevealedEmailProps;

export function RevealedEmailSidebar(props: RevealedEmailSidebarProps) {
  return (
    <ProtectedEmailRevealedButton
      presentation="sidebar"
      email={props.email}
      label={props.label}
      showAddress={props.showAddress}
      onReveal={props.onReveal}
      ref={props.ref}
    />
  );
}
