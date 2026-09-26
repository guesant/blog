import { RevealTriggerAction } from './reveal-trigger-action';
import type { RevealTriggerProps } from './types';

type RevealTriggerSidebarProps = RevealTriggerProps;

export function RevealTriggerSidebar(props: RevealTriggerSidebarProps) {
  return (
    <RevealTriggerAction
      {...props}
      iconSize={14}
      siteVariant={props.buttonSiteVariant ?? 'sidebar'}
      size="small"
    />
  );
}
