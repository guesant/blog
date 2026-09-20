import MuiChevronRight from '@mui/icons-material/ChevronRight';
import { createUiComponent, type UiProps } from './ui-component';

export const ChevronRight = createUiComponent<typeof MuiChevronRight>(function ChevronRight(
  props: UiProps,
) {
  return <MuiChevronRight {...(props as Record<string, unknown>)} />;
});
