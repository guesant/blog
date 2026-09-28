import type { ComponentProps } from 'react';
import BaseButtonGroup from '@mui/material/ButtonGroup';

export type ButtonGroupProps = ComponentProps<typeof BaseButtonGroup>;

export function ButtonGroup(props: ButtonGroupProps) {
  return <BaseButtonGroup {...props} />;
}
