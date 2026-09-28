import type { ComponentProps } from 'react';
import BaseStack from '@mui/material/Stack';

export type StackProps = ComponentProps<typeof BaseStack>;

export function Stack(props: StackProps) {
  return <BaseStack {...props} />;
}
