import type { ComponentProps } from 'react';
import BaseToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export type ToggleButtonGroupProps = ComponentProps<typeof BaseToggleButtonGroup>;

export function ToggleButtonGroup(props: ToggleButtonGroupProps) {
  return <BaseToggleButtonGroup {...props} />;
}
