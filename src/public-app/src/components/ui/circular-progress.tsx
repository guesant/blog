import type { ComponentProps } from 'react';
import BaseCircularProgress from '@mui/material/CircularProgress';

export type CircularProgressProps = ComponentProps<typeof BaseCircularProgress>;

export function CircularProgress(props: CircularProgressProps) {
  return <BaseCircularProgress {...props} />;
}
