'use client';

import { Box, Button, Typography } from '../../ui';
import type { RevealDialogErrorProps } from './types';

export function RevealDialogError(props: RevealDialogErrorProps) {
  const { onRetry, t } = props;

  return (
    <Box visualVariant="revealDialogError">
      <Typography variant="body2" color="error">
        {t('revealError')}
      </Typography>
      <Button type="button" size="small" variant="outlined" onClick={onRetry}>
        {t('reveal')}
      </Button>
    </Box>
  );
}
