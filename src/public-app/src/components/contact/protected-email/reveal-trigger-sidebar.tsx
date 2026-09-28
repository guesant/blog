import { ProtectedEmailTriggerButton } from '../../ui';
import type { RevealTriggerProps } from './types';

type RevealTriggerSidebarProps = RevealTriggerProps;

export function RevealTriggerSidebar(props: RevealTriggerSidebarProps) {
  return (
    <ProtectedEmailTriggerButton
      presentation="sidebar"
      busy={props.busy}
      label={props.label}
      onReveal={props.onReveal}
    />
  );
}
