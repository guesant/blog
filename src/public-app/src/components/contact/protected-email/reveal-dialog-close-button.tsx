import { Icon } from '../../primitives/icon';
import { IconButton } from '../../ui';
import type { Translate } from './types';

type RevealDialogCloseButtonProps = { onClose: () => void; t: Translate };

export function RevealDialogCloseButton(props: RevealDialogCloseButtonProps) {
  return (
    <IconButton
      onClick={props.onClose}
      size="small"
      aria-label={props.t('close')}
      visualVariant="revealDialogCloseButton"
    >
      <Icon name="close" size={18} />
    </IconButton>
  );
}
