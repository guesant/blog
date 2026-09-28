import { ProtectedEmailTriggerButton } from '../../ui';
import type { RevealTriggerProps } from './types';

type RevealTriggerButtonProps = RevealTriggerProps;

export function RevealTriggerButton(props: RevealTriggerButtonProps) {
  return (
    <ProtectedEmailTriggerButton
      presentation="contact"
      busy={props.busy}
      label={props.label}
      onReveal={props.onReveal}
    />
  );
}
