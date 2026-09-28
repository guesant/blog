import type { ComponentProps } from 'react';
import BaseTextField from '@mui/material/TextField';

export type TextFieldProps = ComponentProps<typeof BaseTextField>;

export function TextField(props: TextFieldProps) {
  return <BaseTextField {...props} />;
}
