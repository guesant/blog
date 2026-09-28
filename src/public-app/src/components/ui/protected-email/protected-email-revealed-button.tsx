import { Icon } from '../../primitives/icon';
import { Button } from '../button';

type ProtectedEmailRevealedButtonProps = {
  presentation: 'contact' | 'sidebar';
  email: string;
  label: string;
  showAddress: boolean;
  onReveal: () => void;
  ref?: (element: HTMLButtonElement | null) => void;
};

export function ProtectedEmailRevealedButton(props: ProtectedEmailRevealedButtonProps) {
  const contact = props.presentation === 'contact';

  return (
    <Button
      ref={props.ref}
      variant="outlined"
      siteVariant={contact ? 'exploration' : 'sidebar'}
      size={contact ? 'medium' : 'small'}
      startIcon={<Icon name="mail" size={contact ? 18 : 14} />}
      onClick={props.onReveal}
    >
      {props.showAddress ? props.email : props.label}
    </Button>
  );
}
