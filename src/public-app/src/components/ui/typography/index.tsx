import MuiTypography from '@mui/material/Typography';
import { createUiComponent, type UiProps } from '../ui-component';
import { typographyVariants } from './variants';

export const Typography = createUiComponent<typeof MuiTypography>(function Typography(
  props: UiProps,
) {
  return <MuiTypography {...(props as Record<string, unknown>)} />;
}, typographyVariants);
