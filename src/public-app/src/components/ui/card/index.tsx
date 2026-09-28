import type { ElementType } from 'react';
import BaseCard, { CardProps as MuiCardProps } from '@mui/material/Card';

export type CardProps<
  RootComponent extends ElementType = 'div',
  AdditionalProps = {},
> = MuiCardProps<RootComponent, AdditionalProps>;

export function Card<RootComponent extends ElementType = 'div', AdditionalProps = {}>(
  props: CardProps<RootComponent, AdditionalProps>,
) {
  return <BaseCard {...props} />;
}
