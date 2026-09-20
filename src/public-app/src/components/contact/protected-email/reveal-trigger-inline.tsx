import { Link } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealTriggerProps } from './types';

type RevealTriggerInlineProps = RevealTriggerProps;

export function RevealTriggerInline(props: RevealTriggerInlineProps) {
  return (
    <Link
      component="button"
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      color={props.color}
      underline={props.underline}
      variant={props.typographyVariant}
      visualVariant={
        props.visualVariant ??
        (props.busy ? 'protectedEmailInlineTriggerBusy' : 'protectedEmailInlineTrigger')
      }
    >
      <Icon name="mail" size={14} />
      {props.label}
    </Link>
  );
}
