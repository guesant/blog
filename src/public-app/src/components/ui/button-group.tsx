import MuiButtonGroup from '@mui/material/ButtonGroup';
import { createUiComponent, type UiProps } from './ui-component';
import { buttonGroupVariants } from './button-group-variants';

export const ButtonGroup = createUiComponent<typeof MuiButtonGroup>(function ButtonGroup(
  props: UiProps,
) {
  return <MuiButtonGroup {...(props as Record<string, unknown>)} />;
}, buttonGroupVariants);
