import { Icon } from '../../primitives/icon';
import { SidebarButton } from '../semantic/SidebarButton';
import type { ProtectedEmailTriggerButtonProps as ProtectedEmailTriggerButtonContentProps } from './protected-email-button-types';

type ProtectedEmailSidebarTriggerButtonProps = ProtectedEmailTriggerButtonContentProps;

export function ProtectedEmailSidebarTriggerButton(props: ProtectedEmailSidebarTriggerButtonProps) {
  return (
    <SidebarButton
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      startIcon={<Icon name="mail" size={14} />}
    >
      {props.label}
    </SidebarButton>
  );
}
