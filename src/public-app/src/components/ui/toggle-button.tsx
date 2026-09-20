import MuiToggleButton from '@mui/material/ToggleButton';
import type { ComponentProps } from 'react';
import { createUiComponent } from './ui-component';

export const ToggleButton = createUiComponent<
  typeof MuiToggleButton,
  ComponentProps<typeof MuiToggleButton>
>(function ToggleButton(props: ComponentProps<typeof MuiToggleButton>) {
  return <MuiToggleButton {...props} />;
});
