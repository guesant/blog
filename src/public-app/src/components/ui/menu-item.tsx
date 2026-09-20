import MuiMenuItem from '@mui/material/MenuItem';
import { createUiComponent, type UiProps } from './ui-component';

export const MenuItem = createUiComponent<typeof MuiMenuItem>(function MenuItem(props: UiProps) {
  return <MuiMenuItem {...(props as Record<string, unknown>)} />;
});
