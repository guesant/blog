import MuiInputAdornment from '@mui/material/InputAdornment';
import type { ComponentProps } from 'react';
import { createUiComponent } from './ui-component';

export const InputAdornment = createUiComponent<
  typeof MuiInputAdornment,
  ComponentProps<typeof MuiInputAdornment>
>(function InputAdornment(props: ComponentProps<typeof MuiInputAdornment>) {
  return <MuiInputAdornment {...props} />;
});
