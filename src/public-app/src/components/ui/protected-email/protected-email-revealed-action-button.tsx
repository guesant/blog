import { Icon } from '../../primitives/icon';
import { ContactActionButton } from '../semantic/ContactActionButton';
import type { ProtectedEmailRevealedButtonProps } from './protected-email-button-types';

type ProtectedEmailRevealedActionButtonProps = ProtectedEmailRevealedButtonProps & {
  size: 'small' | 'medium';
  iconSize: number;
};

export function ProtectedEmailRevealedActionButton(props: ProtectedEmailRevealedActionButtonProps) {
  return (
    <ContactActionButton
      ref={props.ref}
      variant="outlined"
      size={props.size}
      startIcon={<Icon name="mail" size={props.iconSize} />}
      onClick={props.onReveal}
    >
      {props.showAddress ? props.email : props.label}
    </ContactActionButton>
  );
}
