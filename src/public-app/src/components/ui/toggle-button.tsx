import type { ComponentProps } from 'react';
import BaseToggleButton from '@mui/material/ToggleButton';

export type ToggleButtonProps = ComponentProps<typeof BaseToggleButton>;

export function ToggleButton(props: ToggleButtonProps) {
  return <BaseToggleButton {...props} />;
}
