import { Icon } from '../../primitives/icon';
import { ContactActionButton } from '../semantic/ContactActionButton';
import { ProtectedEmailSidebarButton } from '../semantic/ProtectedEmailSidebarButton';

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

  const Frame = contact ? ContactActionButton : ProtectedEmailSidebarButton;

  return (
    <Frame
      ref={props.ref}
      variant="outlined"
      size={contact ? 'medium' : 'small'}
      startIcon={<Icon name="mail" size={contact ? 18 : 14} />}
      onClick={props.onReveal}
    >
      {props.showAddress ? props.email : props.label}
    </Frame>
  );
}
