import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealTriggerProps } from './types';

type RevealTriggerButtonProps = RevealTriggerProps;

export function RevealTriggerButton(props: RevealTriggerButtonProps) {
  return (
    <Button
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      siteVariant={props.buttonSiteVariant ?? 'contact'}
      visualVariant={props.visualVariant}
      size="medium"
      startIcon={<Icon name="mail" size={18} />}
    >
      {props.label}
    </Button>
  );
}
