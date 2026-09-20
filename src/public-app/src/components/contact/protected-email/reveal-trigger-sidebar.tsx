import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealTriggerProps } from './types';

type RevealTriggerSidebarProps = RevealTriggerProps;

export function RevealTriggerSidebar(props: RevealTriggerSidebarProps) {
  return (
    <Button
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      siteVariant={props.buttonSiteVariant ?? 'sidebar'}
      visualVariant={props.visualVariant}
      size="small"
      startIcon={<Icon name="mail" size={14} />}
    >
      {props.label}
    </Button>
  );
}
