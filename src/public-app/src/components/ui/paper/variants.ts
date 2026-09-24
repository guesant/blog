import type { SxProps, Theme } from '@mui/material/styles';

export const paperVariants: Record<string, SxProps<Theme>> = {
  profileSummary: { p: 3, bgcolor: 'rgba(255,255,255,.45)' },
  snippetFile: { overflow: 'hidden' },
  passwordGeneratorForm: { p: { xs: 3, md: 4 }, maxWidth: '48rem' },
  randomStringForm: { p: { xs: 3, md: 4 }, maxWidth: '48rem' },
  generatedString: { p: 1.5 },
};
