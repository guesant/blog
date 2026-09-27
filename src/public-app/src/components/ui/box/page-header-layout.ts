import type { SxProps, Theme } from '@mui/material/styles';

export const pageHeaderLayout: SxProps<Theme> = {
  display: 'grid',
  rowGap: 'var(--site-space-2)',
};

export const pageIntroLayout: SxProps<Theme> = {
  ...pageHeaderLayout,
  rowGap: 'var(--site-space-4)',
  marginBlockStart: 0,
  marginBlockEnd: 'var(--site-page-content-offset)',
};
