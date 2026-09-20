import MuiDrawer from '@mui/material/Drawer';
import { createUiComponent, type UiProps } from '../ui-component';
import { drawerVariants } from './variants';

export const Drawer = createUiComponent<typeof MuiDrawer>(function Drawer(props: UiProps) {
  return <MuiDrawer {...(props as Record<string, unknown>)} />;
}, drawerVariants);
