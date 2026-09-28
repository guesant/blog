import type { ReactNode } from 'react';
import { DialogTitle } from '../dialog-title';

type ProtectedEmailDialogTitleFrameProps = { children: ReactNode };

const titleStyles = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--site-space-2)',
  paddingInlineEnd: 'var(--site-space-12)',
  textAlign: 'center',
};

export function ProtectedEmailDialogTitleFrame(props: ProtectedEmailDialogTitleFrameProps) {
  return <DialogTitle sx={titleStyles}>{props.children}</DialogTitle>;
}
