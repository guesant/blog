'use client';

import { Box, Typography, NoScript } from '../../ui';
import type { RevealPanelProps } from './types';
import { RevealTrigger } from './reveal-trigger';

export function RevealPanel(props: RevealPanelProps) {
  const {
    state,
    variant,
    visualVariant,
    buttonSiteVariant,
    color,
    underline,
    typographyVariant,
    onReveal,
    t,
  } = props;

  const busy = state === 'working';

  return (
    <Box visualVariant="revealPanel">
      <RevealTrigger
        busy={busy}
        variant={variant}
        visualVariant={visualVariant}
        buttonSiteVariant={buttonSiteVariant}
        color={color}
        underline={underline}
        typographyVariant={typographyVariant}
        label={t('reveal')}
        onReveal={onReveal}
      />
      <NoScript>
        <Typography variant="body2" color="text.secondary">
          {t('revealNoScript')}
        </Typography>
      </NoScript>
    </Box>
  );
}
