import type { ComponentProps } from 'react';
import BaseFormControl from '@mui/material/FormControl';

export type FormControlProps = ComponentProps<typeof BaseFormControl>;

export function FormControl(props: FormControlProps) {
  return <BaseFormControl {...props} />;
}
