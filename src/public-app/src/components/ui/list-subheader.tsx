import MuiListSubheader from '@mui/material/ListSubheader';
import { createUiComponent, type UiProps } from './ui-component';

export const ListSubheader = createUiComponent<typeof MuiListSubheader>(function ListSubheader(
  props: UiProps,
) {
  return <MuiListSubheader {...(props as Record<string, unknown>)} />;
});
