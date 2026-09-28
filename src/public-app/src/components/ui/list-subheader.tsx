import type { ComponentProps } from 'react';
import BaseListSubheader from '@mui/material/ListSubheader';

export type ListSubheaderProps = ComponentProps<typeof BaseListSubheader>;

export function ListSubheader(props: ListSubheaderProps) {
  return <BaseListSubheader {...props} />;
}
