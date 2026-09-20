import MuiFormControl from '@mui/material/FormControl';
import { createUiComponent, type UiProps } from '../ui-component';
import { formControlVariants } from './variants';

export const FormControl = createUiComponent<typeof MuiFormControl>(function FormControl(
  props: UiProps,
) {
  return <MuiFormControl {...(props as Record<string, unknown>)} />;
}, formControlVariants);
