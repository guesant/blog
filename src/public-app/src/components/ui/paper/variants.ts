import type { SxProps, Theme } from '@mui/material/styles';

export const paperVariants: Record<string, SxProps<Theme>> = {
  profileSummary: { p: 3, bgcolor: 'rgba(255,255,255,.45)' },
  snippetFile: { overflow: 'hidden' },
  passwordGeneratorForm: { p: { xs: 3, md: 4 }, maxWidth: '48rem' },
  legacyToolWorkbench: {
    p: { xs: 2, sm: 3 },
    maxWidth: '52rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
  },
  randomStringForm: { p: { xs: 3, md: 4 }, maxWidth: '48rem' },
  generatedString: { p: 1.5 },
};
