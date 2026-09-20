import MuiInputLabel from '@mui/material/InputLabel';
import { createUiComponent, type UiProps } from './ui-component';

export const InputLabel = createUiComponent<typeof MuiInputLabel>(function InputLabel(
  props: UiProps,
) {
  return <MuiInputLabel {...(props as Record<string, unknown>)} />;
});
