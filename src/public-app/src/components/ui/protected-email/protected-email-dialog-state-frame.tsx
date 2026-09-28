import type { ReactNode } from 'react';
import { Box } from '../box';

export type ProtectedEmailDialogStateLayout = 'stacked' | 'inline';

type ProtectedEmailDialogStateFrameProps = {
  layout: ProtectedEmailDialogStateLayout;
  children: ReactNode;
};

const stackedStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--site-space-3)',
  alignItems: 'center',
};

const inlineStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--site-space-3)',
};

export function ProtectedEmailDialogStateFrame(props: ProtectedEmailDialogStateFrameProps) {
  return <Box sx={props.layout === 'inline' ? inlineStyles : stackedStyles}>{props.children}</Box>;
}
