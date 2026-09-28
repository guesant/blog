import type { ComponentProps } from 'react';
import BaseDrawer from '@mui/material/Drawer';

export type DrawerProps = ComponentProps<typeof BaseDrawer>;

export function Drawer(props: DrawerProps) {
  return <BaseDrawer {...props} />;
}
