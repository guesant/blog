import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { RevealedEmailProps } from './types';

type RevealedEmailButtonProps = RevealedEmailProps;

export function RevealedEmailButton(props: RevealedEmailButtonProps) {
  return (
    <Button
      ref={props.ref}
      component="a"
      href={`mailto:${props.email}`}
      variant="outlined"
      siteVariant={props.buttonSiteVariant ?? 'contact'}
      visualVariant={props.visualVariant}
      size="medium"
      startIcon={<Icon name="mail" size={18} />}
    >
      {props.showAddress ? props.email : props.label}
    </Button>
  );
}
