import { ProtectedEmailInlineAction } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealTriggerProps } from './types';

type RevealTriggerInlineProps = RevealTriggerProps;

export function RevealTriggerInline(props: RevealTriggerInlineProps) {
  return (
    <ProtectedEmailInlineAction
      mode={props.busy ? 'triggerBusy' : 'trigger'}
      onClick={props.onReveal}
      disabled={props.busy}
      color={props.color}
      underline={props.underline}
    >
      <Icon name="mail" size={14} />
      {props.label}
    </ProtectedEmailInlineAction>
  );
}
