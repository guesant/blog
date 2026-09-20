import type { SxProps, Theme } from '@mui/material/styles';

export const dialogContentVariants: Record<string, SxProps<Theme>> = {
  revealDialogContentView: {
    pb: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
};
