import MuiPaper from '@mui/material/Paper';
import { createUiComponent, type UiProps } from '../ui-component';
import { paperVariants } from './variants';

export const Paper = createUiComponent<typeof MuiPaper>(function Paper(props: UiProps) {
  return <MuiPaper {...(props as Record<string, unknown>)} />;
}, paperVariants);
