import type { ReactNode } from 'react';
import { Box } from '../box';

type ProtectedEmailPanelFrameProps = { children: ReactNode };

const panelStyles = {
  display: 'inline-flex',
  flexDirection: 'column',
  gap: 'var(--site-space-2)',
  alignItems: 'flex-start',
};

export function ProtectedEmailPanelFrame(props: ProtectedEmailPanelFrameProps) {
  return <Box sx={panelStyles}>{props.children}</Box>;
}
