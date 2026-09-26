import { RevealedEmailAction } from './revealed-email-action';
import type { RevealedEmailProps } from './types';

type RevealedEmailButtonProps = RevealedEmailProps;

export function RevealedEmailButton(props: RevealedEmailButtonProps) {
  return (
    <RevealedEmailAction
      {...props}
      iconSize={18}
      siteVariant={props.buttonSiteVariant ?? 'contact'}
      size="medium"
    />
  );
}
