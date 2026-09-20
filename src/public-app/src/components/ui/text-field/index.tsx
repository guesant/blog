import MuiTextField from '@mui/material/TextField';
import { createUiComponent, type UiProps } from '../ui-component';
import { textFieldVariants } from './variants';

export const TextField = createUiComponent<typeof MuiTextField>(function TextField(props: UiProps) {
  return <MuiTextField {...(props as Record<string, unknown>)} />;
}, textFieldVariants);
