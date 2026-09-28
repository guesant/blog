import type { ComponentProps } from 'react';
import BaseBrightnessAuto from '@mui/icons-material/BrightnessAuto';

export type BrightnessAutoProps = ComponentProps<typeof BaseBrightnessAuto>;

export function BrightnessAuto(props: BrightnessAutoProps) {
  return <BaseBrightnessAuto {...props} />;
}
