import type { ComponentProps } from 'react';
import BaseDivider from '@mui/material/Divider';

export type DividerProps = ComponentProps<typeof BaseDivider>;

export function Divider(props: DividerProps) {
  return <BaseDivider {...props} />;
}
