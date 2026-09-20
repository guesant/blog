'use client';

import { Dialog } from '../../ui';
import type { RevealDialogProps } from './types';
import { RevealDialogContentView } from './reveal-dialog-content-view';
import { RevealDialogTitleView } from './reveal-dialog-title-view';

export function RevealDialog(props: RevealDialogProps) {
  const { open, onClose, state, email, onRetry, t } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="protected-email-title"
    >
      <RevealDialogTitleView state={state} onClose={onClose} t={t} />
      <RevealDialogContentView state={state} email={email} onRetry={onRetry} t={t} />
    </Dialog>
  );
}
