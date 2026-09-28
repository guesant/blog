import type { ComponentProps } from 'react';
import BaseArrowForward from '@mui/icons-material/ArrowForward';

export type ArrowForwardProps = ComponentProps<typeof BaseArrowForward>;

export function ArrowForward(props: ArrowForwardProps) {
  return <BaseArrowForward {...props} />;
}
