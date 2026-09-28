import type { ElementType } from 'react';
import BaseMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';

export type MenuItemProps<
  RootComponent extends ElementType = 'li',
  AdditionalProps = {},
> = MuiMenuItemProps<RootComponent, AdditionalProps>;

export function MenuItem<RootComponent extends ElementType = 'li', AdditionalProps = {}>(
  props: MenuItemProps<RootComponent, AdditionalProps>,
) {
  return <BaseMenuItem {...props} />;
}
