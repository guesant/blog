import { RevealTriggerAction } from './reveal-trigger-action';
import type { RevealTriggerProps } from './types';

type RevealTriggerButtonProps = RevealTriggerProps;

export function RevealTriggerButton(props: RevealTriggerButtonProps) {
  return (
    <RevealTriggerAction
      {...props}
      iconSize={18}
      siteVariant={props.buttonSiteVariant ?? 'contact'}
      size="medium"
    />
  );
}
