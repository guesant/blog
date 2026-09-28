import type { ComponentProps } from 'react';
import BaseMenu from '@mui/material/Menu';

export type MenuProps = ComponentProps<typeof BaseMenu>;

export function Menu(props: MenuProps) {
  return <BaseMenu {...props} />;
}
