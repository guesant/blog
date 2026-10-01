import { Icon } from '../../primitives/icon';
import { ContactActionButton } from '../semantic/ContactActionButton';
import type { ProtectedEmailTriggerButtonProps as ProtectedEmailTriggerButtonContentProps } from './protected-email-button-types';

type ProtectedEmailContactTriggerButtonProps = ProtectedEmailTriggerButtonContentProps;

export function ProtectedEmailContactTriggerButton(props: ProtectedEmailContactTriggerButtonProps) {
  return (
    <ContactActionButton
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      size="medium"
      startIcon={<Icon name="mail" size={18} />}
    >
      {props.label}
    </ContactActionButton>
  );
}
