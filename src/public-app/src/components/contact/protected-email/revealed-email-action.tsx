import { Button, type SiteButtonVariant } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealedEmailProps } from './types';

type RevealedEmailActionProps = RevealedEmailProps & {
  iconSize: number;
  siteVariant: SiteButtonVariant;
  size: 'small' | 'medium';
};

export function RevealedEmailAction(props: RevealedEmailActionProps) {
  return (
    <Button
      ref={props.ref}
      variant="outlined"
      siteVariant={props.siteVariant}
      visualVariant={props.visualVariant}
      size={props.size}
      startIcon={<Icon name="mail" size={props.iconSize} />}
      onClick={props.onReveal}
    >
      {props.showAddress ? props.email : props.label}
    </Button>
  );
}
