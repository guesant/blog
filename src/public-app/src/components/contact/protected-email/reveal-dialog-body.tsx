'use client';

import type { RevealDialogBodyProps } from './types';
import { RevealDialogWorking } from './reveal-dialog-working';
import { RevealDialogRevealed } from './reveal-dialog-revealed';
import { RevealDialogError } from './reveal-dialog-error';

export function RevealDialogBody(props: RevealDialogBodyProps) {
  const { state, email, onRetry, t } = props;

  if (state === 'working') {
    return <RevealDialogWorking t={t} />;
  }
  if (state === 'revealed') {
    return <RevealDialogRevealed email={email} t={t} />;
  }
  if (state === 'error') {
    return <RevealDialogError onRetry={onRetry} t={t} />;
  }
  return null;
}
