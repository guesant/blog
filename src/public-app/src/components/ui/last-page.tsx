import MuiLastPage from '@mui/icons-material/LastPage';
import { createUiComponent, type UiProps } from './ui-component';

export const LastPage = createUiComponent<typeof MuiLastPage>(function LastPage(props: UiProps) {
  return <MuiLastPage {...(props as Record<string, unknown>)} />;
});
