import type { ComponentProps } from 'react';
import BaseInputAdornment from '@mui/material/InputAdornment';

export type InputAdornmentProps = ComponentProps<typeof BaseInputAdornment>;

export function InputAdornment(props: InputAdornmentProps) {
  return <BaseInputAdornment {...props} />;
}
