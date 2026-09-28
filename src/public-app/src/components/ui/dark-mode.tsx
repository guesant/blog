import type { ComponentProps } from 'react';
import BaseDarkMode from '@mui/icons-material/DarkMode';

export type DarkModeProps = ComponentProps<typeof BaseDarkMode>;

export function DarkMode(props: DarkModeProps) {
  return <BaseDarkMode {...props} />;
}
