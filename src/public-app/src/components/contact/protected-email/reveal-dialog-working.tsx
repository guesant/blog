'use client';

import { CircularProgress, ProtectedEmailDialogStateFrame, Typography } from '../../ui';
import type { RevealDialogWorkingProps } from './types';

export function RevealDialogWorking(props: RevealDialogWorkingProps) {
  const { t } = props;

  return (
    <ProtectedEmailDialogStateFrame layout="inline">
      <CircularProgress size={20} />
      <Typography variant="body2">{t('revealing')}</Typography>
    </ProtectedEmailDialogStateFrame>
  );
}
