'use client';

import { Box, Button, Link, Typography } from '../../ui';
import { Icon } from '../../primitives/icon';
import { useCopyToClipboard } from './use-copy-to-clipboard';
import type { RevealDialogRevealedProps } from './types';

export function RevealDialogRevealed(props: RevealDialogRevealedProps) {
  const { email, t } = props;

  const { copied, copy } = useCopyToClipboard();

  return (
    <Box visualVariant="revealDialogRevealed">
      <Typography variant="body2" color="text.secondary">
        {t('revealedIntro')}
      </Typography>
      <Link href={`mailto:${email}`} underline="none" visualVariant="revealDialogRevealed">
        <Icon name="mail" size={16} />
        {email}
      </Link>
      <Button
        type="button"
        size="small"
        variant="outlined"
        startIcon={<Icon name={copied ? 'check' : 'copy'} size={16} />}
        onClick={() => copy(email)}
      >
        {copied ? t('emailCopied') : t('copyEmail')}
      </Button>
    </Box>
  );
}
