import MuiButtonGroup from '@mui/material/ButtonGroup';
import { createUiComponent, type UiProps } from './ui-component';

export const ButtonGroup = createUiComponent<typeof MuiButtonGroup>(function ButtonGroup(
  props: UiProps,
) {
  return <MuiButtonGroup {...(props as Record<string, unknown>)} />;
});
