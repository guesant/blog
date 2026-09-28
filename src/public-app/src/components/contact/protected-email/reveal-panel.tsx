'use client';

import { NoScript, ProtectedEmailPanelFrame, Typography } from '../../ui';
import type { RevealPanelProps } from './types';

export function RevealPanel(props: RevealPanelProps) {
  const { state, t } = props;

  const busy = state === 'working';

  return (
    <ProtectedEmailPanelFrame>
      {props.renderTrigger(busy)}
      <NoScript>
        <Typography variant="body2" color="text.secondary">
          {t('revealNoScript')}
        </Typography>
      </NoScript>
    </ProtectedEmailPanelFrame>
  );
}
