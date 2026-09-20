import MuiContainer from '@mui/material/Container';
import { createUiComponent, type UiProps } from '../ui-component';
import { containerVariants } from './variants';

export const Container = createUiComponent<typeof MuiContainer>(function Container(props: UiProps) {
  return <MuiContainer {...(props as Record<string, unknown>)} />;
}, containerVariants);
