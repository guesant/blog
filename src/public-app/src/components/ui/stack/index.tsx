import MuiStack from '@mui/material/Stack';
import { createUiComponent, type UiProps } from '../ui-component';
import { stackVariants } from './variants';

export const Stack = createUiComponent<typeof MuiStack>(function Stack(props: UiProps) {
  return <MuiStack {...(props as Record<string, unknown>)} />;
}, stackVariants);
