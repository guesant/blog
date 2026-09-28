import type { ComponentProps } from 'react';
import BasePaper from '@mui/material/Paper';

export type PaperProps = ComponentProps<typeof BasePaper>;

export function Paper(props: PaperProps) {
  return <BasePaper {...props} />;
}
