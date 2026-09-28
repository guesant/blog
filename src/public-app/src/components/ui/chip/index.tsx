import type { ElementType } from 'react';
import BaseChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';

export type ChipProps<
  RootComponent extends ElementType = 'div',
  AdditionalProps = {},
> = MuiChipProps<RootComponent, AdditionalProps>;

export function Chip<RootComponent extends ElementType = 'div', AdditionalProps = {}>(
  props: ChipProps<RootComponent, AdditionalProps>,
) {
  return <BaseChip {...props} />;
}
