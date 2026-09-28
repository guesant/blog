import type { ElementType } from 'react';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import BaseButton from '@mui/material/Button';

export type ButtonProps<
  RootComponent extends ElementType = 'button',
  AdditionalProps = {},
> = MuiButtonProps<RootComponent, AdditionalProps>;

export function Button<RootComponent extends ElementType = 'button', AdditionalProps = {}>(
  props: ButtonProps<RootComponent, AdditionalProps>,
) {
  return <BaseButton {...props} />;
}
