import MuiBox from '@mui/material/Box';
import { createUiComponent, type UiProps } from '../ui-component';
import { boxVariants } from './variants';

export const Box = createUiComponent<typeof MuiBox>(function Box(props: UiProps) {
  return <MuiBox {...(props as Record<string, unknown>)} />;
}, boxVariants);
