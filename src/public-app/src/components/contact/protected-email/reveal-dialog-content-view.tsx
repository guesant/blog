import { DialogContent } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogLiveRegion } from './reveal-dialog-live-region';

type RevealDialogContentViewProps = Pick<RevealDialogProps, 'state' | 'email' | 'onRetry' | 't'>;

export function RevealDialogContentView(props: RevealDialogContentViewProps) {
  return (
    <DialogContent visualVariant="revealDialogContentView">
      <RevealDialogLiveRegion {...props} />
    </DialogContent>
  );
}
