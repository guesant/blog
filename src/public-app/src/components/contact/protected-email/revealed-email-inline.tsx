import { ProtectedEmailInlineAction } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealedEmailProps } from './types';

type RevealedEmailInlineProps = RevealedEmailProps;

export function RevealedEmailInline(props: RevealedEmailInlineProps) {
  return (
    <ProtectedEmailInlineAction
      mode="revealed"
      onClick={props.onReveal}
      color={props.color}
      underline={props.underline}
    >
      <Icon name="mail" size={16} />
      {props.showAddress ? props.email : props.label}
    </ProtectedEmailInlineAction>
  );
}
