import MuiBrightnessAuto from '@mui/icons-material/BrightnessAuto';
import { createUiComponent, type UiProps } from './ui-component';

export const BrightnessAuto = createUiComponent<typeof MuiBrightnessAuto>(function BrightnessAuto(
  props: UiProps,
) {
  return <MuiBrightnessAuto {...(props as Record<string, unknown>)} />;
});
