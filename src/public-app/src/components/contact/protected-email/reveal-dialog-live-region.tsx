import { Box } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogBody } from './reveal-dialog-body';

type RevealDialogLiveRegionProps = Pick<RevealDialogProps, 'state' | 'email' | 'onRetry' | 't'>;

export function RevealDialogLiveRegion(props: RevealDialogLiveRegionProps) {
  return (
    <Box aria-live="polite" visualVariant="revealDialogLiveRegion">
      <RevealDialogBody {...props} />
    </Box>
  );
}
