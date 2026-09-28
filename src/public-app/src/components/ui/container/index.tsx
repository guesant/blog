import type { ComponentProps } from 'react';
import BaseContainer from '@mui/material/Container';

export type ContainerProps = ComponentProps<typeof BaseContainer>;

export function Container(props: ContainerProps) {
  return <BaseContainer {...props} />;
}
