import MuiFirstPage from '@mui/icons-material/FirstPage';
import { createUiComponent, type UiProps } from './ui-component';

export const FirstPage = createUiComponent<typeof MuiFirstPage>(function FirstPage(props: UiProps) {
  return <MuiFirstPage {...(props as Record<string, unknown>)} />;
});
