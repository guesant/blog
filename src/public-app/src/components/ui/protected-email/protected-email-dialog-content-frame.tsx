import type { ReactNode } from 'react';
import { DialogContent } from '../dialog-content';

type ProtectedEmailDialogContentFrameProps = { children: ReactNode };

const contentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: 'var(--site-space-4)',
  textAlign: 'center',
};

export function ProtectedEmailDialogContentFrame(props: ProtectedEmailDialogContentFrameProps) {
  return <DialogContent sx={contentStyles}>{props.children}</DialogContent>;
}
