import type { SxProps, Theme } from '@mui/material/styles';

export const dialogTitleVariants: Record<string, SxProps<Theme>> = {
  revealDialogTitleView: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    textAlign: 'center',
    pr: 6,
  },
};
