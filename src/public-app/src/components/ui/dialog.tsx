import type { ComponentProps } from 'react';
import BaseDialog from '@mui/material/Dialog';

export type DialogProps = ComponentProps<typeof BaseDialog>;

export function Dialog(props: DialogProps) {
  return <BaseDialog {...props} />;
}
