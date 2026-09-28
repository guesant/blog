import { Icon } from '../../primitives/icon';
import { ProtectedEmailDialogCloseButton, ProtectedEmailDialogTitleFrame } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogIcon } from './reveal-dialog-icon';

type RevealDialogTitleViewProps = Pick<RevealDialogProps, 'state' | 'onClose' | 't'>;

export function RevealDialogTitleView(props: RevealDialogTitleViewProps) {
  return (
    <ProtectedEmailDialogTitleFrame>
      <RevealDialogIcon state={props.state} />
      {props.t('protectedEmailTitle')}
      <ProtectedEmailDialogCloseButton label={props.t('close')} onClick={props.onClose}>
        <Icon name="close" size={18} />
      </ProtectedEmailDialogCloseButton>
    </ProtectedEmailDialogTitleFrame>
  );
}
