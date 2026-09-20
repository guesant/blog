import MuiDialogTitle from '@mui/material/DialogTitle';
import { createUiComponent, type UiProps } from '../ui-component';
import { dialogTitleVariants } from './variants';

export const DialogTitle = createUiComponent<typeof MuiDialogTitle>(function DialogTitle(
  props: UiProps,
) {
  return <MuiDialogTitle {...(props as Record<string, unknown>)} />;
}, dialogTitleVariants);
