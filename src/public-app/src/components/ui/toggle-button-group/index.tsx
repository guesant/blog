import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createUiComponent, type UiProps } from '../ui-component';
import { toggleButtonGroupVariants } from './variants';

export const ToggleButtonGroup = createUiComponent<typeof MuiToggleButtonGroup>(
  function ToggleButtonGroup(props: UiProps) {
    return <MuiToggleButtonGroup {...(props as Record<string, unknown>)} />;
  },
  toggleButtonGroupVariants,
);
