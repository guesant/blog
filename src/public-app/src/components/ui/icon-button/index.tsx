import MuiIconButton from '@mui/material/IconButton';
import { createUiComponent, type UiProps } from '../ui-component';
import { iconButtonVariants } from './variants';

export const IconButton = createUiComponent<typeof MuiIconButton>(function IconButton(
  props: UiProps,
) {
  return <MuiIconButton {...(props as Record<string, unknown>)} />;
}, iconButtonVariants);
