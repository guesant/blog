import type { ElementType } from 'react';
import BaseIconButton, { IconButtonProps as MuiIconButtonProps } from '@mui/material/IconButton';

export type IconButtonProps<
  RootComponent extends ElementType = 'button',
  AdditionalProps = {},
> = MuiIconButtonProps<RootComponent, AdditionalProps>;

export function IconButton<RootComponent extends ElementType = 'button', AdditionalProps = {}>(
  props: IconButtonProps<RootComponent, AdditionalProps>,
) {
  return <BaseIconButton {...props} />;
}
