import MuiCard from '@mui/material/Card';
import { createUiComponent, type UiProps } from '../ui-component';
import { cardVariants } from './variants';

export const Card = createUiComponent<typeof MuiCard>(function Card(props: UiProps) {
  return <MuiCard {...(props as Record<string, unknown>)} />;
}, cardVariants);
