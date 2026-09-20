import MuiDialog from '@mui/material/Dialog';
import type { ComponentProps } from 'react';
import { createUiComponent } from './ui-component';

export const Dialog = createUiComponent<typeof MuiDialog, ComponentProps<typeof MuiDialog>>(
  function Dialog(props: ComponentProps<typeof MuiDialog>) {
    return <MuiDialog {...props} />;
  },
);
