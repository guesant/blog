import MuiChevronLeft from '@mui/icons-material/ChevronLeft';
import { createUiComponent, type UiProps } from './ui-component';

export const ChevronLeft = createUiComponent<typeof MuiChevronLeft>(function ChevronLeft(
  props: UiProps,
) {
  return <MuiChevronLeft {...(props as Record<string, unknown>)} />;
});
