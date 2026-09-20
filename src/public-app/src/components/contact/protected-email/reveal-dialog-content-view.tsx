import { DialogContent, Typography } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogLiveRegion } from './reveal-dialog-live-region';

type RevealDialogContentViewProps = Pick<RevealDialogProps, 'state' | 'email' | 'onRetry' | 't'>;

export function RevealDialogContentView(props: RevealDialogContentViewProps) {
  return (
    <DialogContent visualVariant="revealDialogContentView">
      <Typography variant="body2" color="text.secondary" visualVariant="revealDialogContentView">
        {props.t('revealHint')}
      </Typography>
      <RevealDialogLiveRegion {...props} />
    </DialogContent>
  );
}
