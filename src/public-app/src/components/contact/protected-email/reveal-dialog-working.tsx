'use client';

import { Box, CircularProgress, Typography } from '../../ui';
import type { RevealDialogWorkingProps } from './types';

export function RevealDialogWorking(props: RevealDialogWorkingProps) {
  const { t } = props;

  return (
    <Box visualVariant="revealDialogWorking">
      <CircularProgress size={20} />
      <Typography variant="body2">{t('revealing')}</Typography>
    </Box>
  );
}
