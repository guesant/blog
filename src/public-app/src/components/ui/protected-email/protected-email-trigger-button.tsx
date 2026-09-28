import { Icon } from '../../primitives/icon';
import { ContactActionButton } from '../semantic/ContactActionButton';
import { ProtectedEmailSidebarButton } from '../semantic/ProtectedEmailSidebarButton';

type ProtectedEmailTriggerButtonProps = {
  presentation: 'contact' | 'sidebar';
  busy: boolean;
  label: string;
  onReveal: () => void;
};

export function ProtectedEmailTriggerButton(props: ProtectedEmailTriggerButtonProps) {
  const contact = props.presentation === 'contact';

  const Frame = contact ? ContactActionButton : ProtectedEmailSidebarButton;

  return (
    <Frame
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      size={contact ? 'medium' : 'small'}
      startIcon={<Icon name="mail" size={contact ? 18 : 14} />}
    >
      {props.label}
    </Frame>
  );
}
