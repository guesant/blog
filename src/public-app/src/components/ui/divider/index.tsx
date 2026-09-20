import MuiDivider from '@mui/material/Divider';
import { createUiComponent, type UiProps } from '../ui-component';
import { dividerVariants } from './variants';

export const Divider = createUiComponent<typeof MuiDivider>(function Divider(props: UiProps) {
  return <MuiDivider {...(props as Record<string, unknown>)} />;
}, dividerVariants);
