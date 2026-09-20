import type { SxProps, Theme } from '@mui/material/styles';

export const toggleButtonGroupVariants: Record<string, SxProps<Theme>> = {
  sidebarToggleGroup: {
    width: '100%',
    '& .MuiToggleButton-root': {
      flex: 1,
      minWidth: 0,
    },
  },
};
