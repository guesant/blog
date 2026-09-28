import type { ComponentProps } from 'react';
import BaseDialogContent from '@mui/material/DialogContent';

export type DialogContentProps = ComponentProps<typeof BaseDialogContent>;

export function DialogContent(props: DialogContentProps) {
  return <BaseDialogContent {...props} />;
}
