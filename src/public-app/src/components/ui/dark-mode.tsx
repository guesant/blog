import MuiDarkMode from '@mui/icons-material/DarkMode';
import { createUiComponent, type UiProps } from './ui-component';

export const DarkMode = createUiComponent<typeof MuiDarkMode>(function DarkMode(props: UiProps) {
  return <MuiDarkMode {...(props as Record<string, unknown>)} />;
});
