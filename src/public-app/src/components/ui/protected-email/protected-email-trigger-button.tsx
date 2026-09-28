import { Icon } from '../../primitives/icon';
import { Button } from '../button';

type ProtectedEmailTriggerButtonProps = {
  presentation: 'contact' | 'sidebar';
  busy: boolean;
  label: string;
  onReveal: () => void;
};

export function ProtectedEmailTriggerButton(props: ProtectedEmailTriggerButtonProps) {
  const contact = props.presentation === 'contact';

  return (
    <Button
      type="button"
      onClick={props.onReveal}
      disabled={props.busy}
      variant="outlined"
      siteVariant={contact ? 'exploration' : 'sidebar'}
      size={contact ? 'medium' : 'small'}
      startIcon={<Icon name="mail" size={contact ? 18 : 14} />}
    >
      {props.label}
    </Button>
  );
}
