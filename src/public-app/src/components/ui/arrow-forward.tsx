import MuiArrowForward from '@mui/icons-material/ArrowForward';
import { createUiComponent, type UiProps } from './ui-component';

export const ArrowForward = createUiComponent<typeof MuiArrowForward>(function ArrowForward(
  props: UiProps,
) {
  return <MuiArrowForward {...(props as Record<string, unknown>)} />;
});
