import type { ProtectedEmailRevealedButtonProps as ProtectedEmailRevealedButtonContentProps } from './protected-email-button-types';
import { Icon } from '../../primitives/icon';
import { SidebarButton } from '../semantic/SidebarButton';

type ProtectedEmailSidebarRevealedButtonProps = ProtectedEmailRevealedButtonContentProps;

export function ProtectedEmailSidebarRevealedButton(
  props: ProtectedEmailSidebarRevealedButtonProps,
) {
  return (
    <SidebarButton
      ref={props.ref}
      startIcon={<Icon name="mail" size={14} />}
      onClick={props.onReveal}
    >
      {props.showAddress ? props.email : props.label}
    </SidebarButton>
  );
}
