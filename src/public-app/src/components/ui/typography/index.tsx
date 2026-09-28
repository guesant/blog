import type { ElementType } from 'react';
import type { TypographyProps as MuiTypographyProps } from '@mui/material/Typography';
import BaseTypography from '@mui/material/Typography';

export type TypographyProps<
  RootComponent extends ElementType = 'span',
  AdditionalProps = {},
> = MuiTypographyProps<RootComponent, AdditionalProps>;

export function Typography<RootComponent extends ElementType = 'span', AdditionalProps = {}>(
  props: TypographyProps<RootComponent, AdditionalProps>,
) {
  return <BaseTypography {...props} />;
}
