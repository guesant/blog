import MuiLightMode from '@mui/icons-material/LightMode';
import { createUiComponent, type UiProps } from './ui-component';

export const LightMode = createUiComponent<typeof MuiLightMode>(function LightMode(props: UiProps) {
  return <MuiLightMode {...(props as Record<string, unknown>)} />;
});
