import MuiCircularProgress from '@mui/material/CircularProgress';
import { createUiComponent, type UiProps } from './ui-component';

export const CircularProgress = createUiComponent<typeof MuiCircularProgress>(
  function CircularProgress(props: UiProps) {
    return <MuiCircularProgress {...(props as Record<string, unknown>)} />;
  },
);
