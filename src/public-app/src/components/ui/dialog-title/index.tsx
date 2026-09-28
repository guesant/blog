import type { ComponentProps } from 'react';
import BaseDialogTitle from '@mui/material/DialogTitle';

export type DialogTitleProps = ComponentProps<typeof BaseDialogTitle>;

export function DialogTitle(props: DialogTitleProps) {
  return <BaseDialogTitle {...props} />;
}
