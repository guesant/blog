import { Button, type SiteButtonVariant } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealTriggerProps } from './types';

type RevealTriggerActionProps = RevealTriggerProps & {
  iconSize: number;
  siteVariant: SiteButtonVariant;
  size: 'small' | 'medium';
};

export function RevealTriggerAction(props: RevealTriggerActionProps) {
  return (
    <Button
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      siteVariant={props.siteVariant}
      visualVariant={props.visualVariant}
      size={props.size}
      startIcon={<Icon name="mail" size={props.iconSize} />}
    >
      {props.label}
    </Button>
  );
}
