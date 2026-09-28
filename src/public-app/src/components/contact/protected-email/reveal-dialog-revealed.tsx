'use client';

import {
  Button,
  ProtectedEmailDialogStateFrame,
  ProtectedEmailRevealedLink,
  Typography,
} from '../../ui';
import { Icon } from '../../primitives/icon';
import { useCopyToClipboard } from './use-copy-to-clipboard';
import type { RevealDialogRevealedProps } from './types';

export function RevealDialogRevealed(props: RevealDialogRevealedProps) {
  const { email, t } = props;

  const { copied, copy } = useCopyToClipboard();

  return (
    <ProtectedEmailDialogStateFrame layout="stacked">
      <Typography variant="body2" color="text.secondary">
        {t('revealedIntro')}
      </Typography>
      <ProtectedEmailRevealedLink href={`mailto:${email}`}>
        <Icon name="mail" size={16} />
        {email}
      </ProtectedEmailRevealedLink>
      <Button
        type="button"
        size="small"
        variant="outlined"
        startIcon={<Icon name={copied ? 'check' : 'copy'} size={16} />}
        onClick={() => copy(email)}
      >
        {copied ? t('emailCopied') : t('copyEmail')}
      </Button>
    </ProtectedEmailDialogStateFrame>
  );
}
