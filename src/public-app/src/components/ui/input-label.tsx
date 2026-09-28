import type { ComponentProps } from 'react';
import BaseInputLabel from '@mui/material/InputLabel';

export type InputLabelProps = ComponentProps<typeof BaseInputLabel>;

export function InputLabel(props: InputLabelProps) {
  return <BaseInputLabel {...props} />;
}
