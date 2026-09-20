import MuiDialogContent from '@mui/material/DialogContent';
import { createUiComponent, type UiProps } from '../ui-component';
import { dialogContentVariants } from './variants';

export const DialogContent = createUiComponent<typeof MuiDialogContent>(function DialogContent(
  props: UiProps,
) {
  return <MuiDialogContent {...(props as Record<string, unknown>)} />;
}, dialogContentVariants);
