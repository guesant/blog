import type { ComponentProps } from 'react';
import BaseLightMode from '@mui/icons-material/LightMode';

export type LightModeProps = ComponentProps<typeof BaseLightMode>;

export function LightMode(props: LightModeProps) {
  return <BaseLightMode {...props} />;
}
