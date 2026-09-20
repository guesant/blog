import MuiMenu from '@mui/material/Menu';
import type { ComponentProps } from 'react';
import { createUiComponent } from './ui-component';

export const Menu = createUiComponent<typeof MuiMenu, ComponentProps<typeof MuiMenu>>(function Menu(
  props: ComponentProps<typeof MuiMenu>,
) {
  return <MuiMenu {...props} />;
});
