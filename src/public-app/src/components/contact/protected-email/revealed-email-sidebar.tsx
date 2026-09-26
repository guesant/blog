import { RevealedEmailAction } from './revealed-email-action';
import type { RevealedEmailProps } from './types';

type RevealedEmailSidebarProps = RevealedEmailProps;

export function RevealedEmailSidebar(props: RevealedEmailSidebarProps) {
  return (
    <RevealedEmailAction
      {...props}
      iconSize={14}
      siteVariant={props.buttonSiteVariant ?? 'sidebar'}
      size="small"
    />
  );
}
