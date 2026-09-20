import type { SxProps, Theme } from '@mui/material/styles';

export const formControlVariants: Record<string, SxProps<Theme>> = {
  listingField: {
    width: { xs: '100%', md: 'auto' },
    minWidth: { xs: 0, md: 'var(--site-field-min-sm)' },
    flex: { xs: '1 1 100%', md: '1 1 var(--site-field-min-sm)' },
  },
};
