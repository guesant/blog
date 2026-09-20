import { DialogTitle } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogCloseButton } from './reveal-dialog-close-button';
import { RevealDialogIcon } from './reveal-dialog-icon';

type RevealDialogTitleViewProps = Pick<RevealDialogProps, 'state' | 'onClose' | 't'>;

export function RevealDialogTitleView(props: RevealDialogTitleViewProps) {
  return (
    <DialogTitle id="protected-email-title" visualVariant="revealDialogTitleView">
      <RevealDialogIcon state={props.state} />
      {props.t('protectedEmailTitle')}
      <RevealDialogCloseButton onClose={props.onClose} t={props.t} />
    </DialogTitle>
  );
}
