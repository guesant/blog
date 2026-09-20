import type { SxProps, Theme } from '@mui/material/styles';

export const textFieldVariants: Record<string, SxProps<Theme>> = {
  passwordResult: { '& input': { fontFamily: 'var(--site-font-mono)' } },
  feedSearchField: {
    width: 'auto',
    minWidth: 0,
    flex: '1 1 auto',
  },
  toolsSearchField: {
    width: { xs: '100%', md: 'auto' },
    minWidth: { xs: 0, md: 'var(--site-field-min)' },
    flexBasis: { xs: '100%', md: 'var(--site-field-min)' },
  },
};
