import { ProtectedEmailDialogContentFrame } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogLiveRegion } from './reveal-dialog-live-region';

type RevealDialogContentViewProps = Pick<RevealDialogProps, 'state' | 'email' | 'onRetry' | 't'>;

export function RevealDialogContentView(props: RevealDialogContentViewProps) {
  return (
    <ProtectedEmailDialogContentFrame>
      <RevealDialogLiveRegion {...props} />
    </ProtectedEmailDialogContentFrame>
  );
}
