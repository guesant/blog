import { Icon } from '../../primitives/icon';
import { ContactActionButton } from '../semantic/ContactActionButton';
import type { ProtectedEmailTriggerButtonProps as ProtectedEmailTriggerButtonContentProps } from './protected-email-button-types';

type ProtectedEmailSidebarTriggerButtonProps = ProtectedEmailTriggerButtonContentProps;

export function ProtectedEmailSidebarTriggerButton(props: ProtectedEmailSidebarTriggerButtonProps) {
  return (
    <ContactActionButton
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      size="small"
      startIcon={<Icon name="mail" size={14} />}
    >
      {props.label}
    </ContactActionButton>
  );
}
