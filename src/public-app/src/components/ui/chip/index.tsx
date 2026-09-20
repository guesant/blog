import MuiChip from '@mui/material/Chip';
import { createUiComponent, type UiProps } from '../ui-component';
import { chipVariants } from './variants';

export const Chip = createUiComponent<typeof MuiChip>(function Chip(props: UiProps) {
  return <MuiChip {...(props as Record<string, unknown>)} />;
}, chipVariants);
