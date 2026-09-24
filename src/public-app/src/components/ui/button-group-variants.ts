import type { SxProps, Theme } from '@mui/material/styles';

export const buttonGroupVariants: Record<string, SxProps<Theme>> = {
  resumePdf: {
    '& .MuiButtonGroup-grouped': {
      borderColor: 'var(--site-primary)',
      borderWidth: 'var(--site-border-width)',
    },
    '& .MuiButtonGroup-grouped:not(:last-of-type)': {
      borderRightColor: 'var(--site-primary)',
    },
    '& .MuiButtonGroup-grouped:hover': {
      borderColor: 'var(--site-primary-hover)',
    },
  },
};
