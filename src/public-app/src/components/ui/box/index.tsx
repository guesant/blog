import type { ElementType } from 'react';
import type { BoxProps as MuiBoxProps } from '@mui/material/Box';
import BaseBox from '@mui/material/Box';

export type BoxProps<RootComponent extends ElementType = 'div', AdditionalProps = {}> = MuiBoxProps<
  RootComponent,
  AdditionalProps
>;

export function Box<RootComponent extends ElementType = 'div', AdditionalProps = {}>(
  props: BoxProps<RootComponent, AdditionalProps>,
) {
  return <BaseBox {...props} />;
}
