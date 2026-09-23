import type { SxProps, Theme } from '@mui/material/styles';

export const richTextBody: SxProps<Theme> = {
  mt: 6,
  pt: 5,
  borderTop: 1,
  borderColor: 'divider',
  '& p, & li': {
    fontSize: 'var(--site-text-body)',
    lineHeight: 'var(--site-leading-relaxed)',
  },
  '& p': { mb: 3 },
  '& h2': { mt: 5, mb: 2, fontSize: 'var(--site-text-2xl)' },
  '& h3': { mt: 4, mb: 1.5, fontSize: 'var(--site-text-xl)' },
  '& pre': { overflowX: 'auto', p: 2, bgcolor: 'background.paper' },
  '& code': { fontFamily: 'var(--site-font-mono)' },
};
