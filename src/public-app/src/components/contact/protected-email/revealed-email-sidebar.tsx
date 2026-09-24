import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealedEmailProps } from './types';

type RevealedEmailSidebarProps = RevealedEmailProps;

export function RevealedEmailSidebar(props: RevealedEmailSidebarProps) {
  return (
    <Button
      ref={props.ref}
      variant="outlined"
      siteVariant={props.buttonSiteVariant ?? 'sidebar'}
      visualVariant={props.visualVariant}
      size="small"
      startIcon={<Icon name="mail" size={14} />}
      onClick={props.onReveal}
    >
      {props.showAddress ? props.email : props.label}
    </Button>
  );
}
